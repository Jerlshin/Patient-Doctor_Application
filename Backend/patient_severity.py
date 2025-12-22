import os
import csv
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from PyPDF2 import PdfReader
import pickle
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
import numpy as np
import speech_recognition as sr
from transformers import BertForSequenceClassification, BertTokenizerFast

app = Flask(__name__)
CORS(app) 
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

# --- PATH CONFIGURATION ---
# This gets the absolute path to the folder where patient_severity.py is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def get_path(folder_name):
    return os.path.join(BASE_DIR, folder_name)
# ---------------------------

tokenizer = AutoTokenizer.from_pretrained("distilbert-base-cased-distilled-squad")

# Use absolute path for the pickle file
with open(get_path('QA_Model_cpu.pkl'), 'rb') as f:
    model = pickle.load(f)

# FINE TUNED MODEL
model_path = get_path("patientRequestSummarization")
finetuned_model = BertForSequenceClassification.from_pretrained(model_path)
finetuned_tokenizer = BertTokenizerFast.from_pretrained(model_path)

r = sr.Recognizer()

# Conversation Models
pat_doc_model = AutoModelForSeq2SeqLM.from_pretrained(get_path("Conversation_MODEL"))
pat_doc_tokenizer = AutoTokenizer.from_pretrained(get_path("Conversation_TOK"))

# Meme Summarization Models
tokenizer2 = AutoTokenizer.from_pretrained(get_path("MEME_TOKENIZER"))  
model2 = AutoModelForSeq2SeqLM.from_pretrained(get_path("MEME_MODEL"))
summarizer = pipeline("summarization", tokenizer=tokenizer2, model=model2, device=-1)
#Patient-Doctor Chat Summrixation
def preprocess_conversation(conversation):
    inputs = pat_doc_tokenizer(conversation, return_tensors="pt") 
    return inputs 

def summarize(conversation):
    inputs = preprocess_conversation(conversation)
    output = pat_doc_model.generate(**inputs)
    summary = pat_doc_tokenizer.decode(output[0], skip_special_tokens=True)
    
    return summary 


#ASR module
def recognize_speech(source):
  audio = r.listen(source)
  try:
    text = r.recognize_google(audio)
    return jsonify({'message': text})
  except sr.UnknownValueError:
    return jsonify({'message': "Sorry, could not understand audio"})
  except sr.RequestError as e:
    return jsonify({'message': "Could not request results from Google Speech Recognition service; {0}".format(e)})

# Function to predict severity
def predict(text):
    # Ensure truncation is active to prevent long messages from crashing BERT
    inputs = finetuned_tokenizer(text, padding=True, truncation=True, max_length=512, return_tensors="pt")
    outputs = finetuned_model(**inputs)
    
    probs = outputs[0].softmax(1)   
    pred_label_idx = probs.argmax()
    
    pred_label = finetuned_model.config.id2label[pred_label_idx.item()]
    return jsonify({'response': pred_label})
            
def extract_text_from_pdf(pdf_path):
    try:
        with open(pdf_path, 'rb') as f:
            reader = PdfReader(f)
            text = ''
            for page_num in range(len(reader.pages)):
                text += reader.pages[page_num].extract_text()
        return text.strip()
    except Exception as e:
        app.logger.error(f"Error extracting text from PDF: {str(e)}")
        raise

def pdf_qna(text, question):
    inputs = tokenizer.encode_plus(question, text, return_tensors="pt")
    input_ids = inputs["input_ids"].tolist()[0]
    inputs.to("cpu")  # Move inputs to CPU

    text_tokens = tokenizer.convert_ids_to_tokens(input_ids)
    answer_model = model(**inputs)

    start_logits = answer_model['start_logits'].cpu().detach().numpy()
    answer_start = np.argmax(start_logits)

    end_logits = answer_model['end_logits'].cpu().detach().numpy()
    answer_end = np.argmax(end_logits) + 1

    answer = tokenizer.convert_tokens_to_string(tokenizer.convert_ids_to_tokens(input_ids[answer_start:answer_end]))
    return jsonify({'response': answer})

        
    
#Document Summrization
# Document Summarization
def doc_sum(text):
    try:
        # Manually slice the first 3000 characters (approx 750-1000 tokens)
        # to ensure it fits within the 1024 token limit.
        truncated_text = text[:3000] 
        
        # Pass the truncated text to the summarizer
        result = summarizer(
            truncated_text, 
            max_length=100, 
            min_length=40, 
            do_sample=False, 
            truncation=True  # Extra safety
        )[0]['summary_text']
        
        return jsonify({'response': result, 'pdfData': text})
    except Exception as e:
        return jsonify({'error': f"Summarization failed: {str(e)}"}), 500



@app.route('/query', methods=['POST'])
def get_query():
    try:
        data = request.get_json()
        user_input = data.get('message', '')

        # Fix: Save PDF to the current project folder instead of D:/
        file_path = get_path("uploaded_file.pdf")
        pdf_text = extract_text_from_pdf(file_path)

        return pdf_qna(pdf_text, user_input)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/upload-pdf', methods=['POST'])
def upload_pdf():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part in the request'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        # Fix: Save PDF to the current project folder instead of D:/
        file_path = get_path("uploaded_file.pdf")
        file.save(file_path)

        pdf_text = extract_text_from_pdf(file_path)
        return doc_sum(pdf_text)
    except Exception as e:
        app.logger.error(f"Error uploading PDF: {str(e)}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/patient_querry', methods=['POST'])
def patient_querry():
    try:
        data = request.get_json()
        message = data.get('message', '')
        return predict(message)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/voice-message', methods=['POST'])
def handle_voice_message():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']
    # Process the audio file here, such as saving it to disk or performing speech-to-text conversion
    #recognize_speech(audio_file)
    return jsonify({'message': 'Voice message received successfully'}), 200

@app.route("/summarize", methods=["POST"])
def summarize_conversation():
    data = request.get_json()
    conversation = data.get("conversation")

    if not conversation:
        return jsonify({"error": "No conversation provided"}), 400
    
    summary = summarize(conversation)
    return jsonify({"summary": summary})


if __name__ == '__main__':
    app.run(debug=True)
