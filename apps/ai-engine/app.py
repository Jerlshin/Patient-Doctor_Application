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
try:
    with open(get_path('QA_Model_cpu.pkl'), 'rb') as f:
        model = pickle.load(f)
except Exception as e:
    print(f"Warning: Could not load QA Model: {e}")
    model = None

# FINE TUNED MODEL
try:
    model_path = get_path("patientRequestSummarization")
    finetuned_model = BertForSequenceClassification.from_pretrained(model_path)
    finetuned_tokenizer = BertTokenizerFast.from_pretrained(model_path)
except Exception as e:
    print(f"Warning: Could not load Fine Tuned Model: {e}")
    finetuned_model = None
    finetuned_tokenizer = None

r = sr.Recognizer()

# Conversation Models
try:
    pat_doc_model = AutoModelForSeq2SeqLM.from_pretrained(get_path("Conversation_MODEL"))
    pat_doc_tokenizer = AutoTokenizer.from_pretrained(get_path("Conversation_TOK"))
except Exception as e:
    print(f"Warning: Could not load Conversation Model: {e}")

# Meme Summarization Models
try:
    tokenizer2 = AutoTokenizer.from_pretrained(get_path("MEME_TOKENIZER"))  
    model2 = AutoModelForSeq2SeqLM.from_pretrained(get_path("MEME_MODEL"))
    summarizer = pipeline("summarization", tokenizer=tokenizer2, model=model2, device=-1)
except Exception as e:
    print(f"Warning: Could not load MEME Model: {e}")
    summarizer = None

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
def recognize_speech(audio_path):
  try:
      with sr.AudioFile(audio_path) as source:
          audio = r.record(source) # read the entire audio file
          text = r.recognize_google(audio)
          return jsonify({'message': text})
  except sr.UnknownValueError:
    return jsonify({'message': "Sorry, could not understand audio"})
  except sr.RequestError as e:
    return jsonify({'message': "Could not request results from Google Speech Recognition service; {0}".format(e)})
  except Exception as e:
      return jsonify({'message': f"Error processing audio file: {str(e)}"})

# Function to predict severity
def predict(text):
    if not finetuned_model:
        return jsonify({'response': "Model not loaded"})
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
    if not model:
        return jsonify({'response': "QA Model not loaded"})
        
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

# Document Summarization
def doc_sum(text):
    if not summarizer:
        return jsonify({'response': "Summarizer not loaded", 'pdfData': text})

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


# --- REFACTORED ENDPOINTS ---

@app.route('/query', methods=['POST'])
def get_query():
    try:
        data = request.get_json()
        user_input = data.get('message', '')
        
        # NOTE: This endpoint assumes a context exists. 
        # For a stateless/robust design, we should really pass the context (PDF text) or file path with EVERY request,
        # OR use a session/database. 
        # Given the refactor scope, we'll assume the frontend/gateway will handle the file logic mostly via /process-pdf
        # BUT if the user asks a follow-up, we need the file.
        # Since I am fixing the hardcoded "uploaded_file.pdf", I can't guess which file to use here without input.
        # However, for now, if this is a general query NOT about a specific file, we might return something else.
        # If it IS about the file, the previous logic read 'uploaded_file.pdf'.
        # I will modify this to accept 'file_path' if provided, otherwise fail gracefully.
        
        # Temporary fallback for demo: if no file_path provided, we can't QA a specific PDF.
        # The frontend/gateway should send 'context' or 'file_path'.
        # I will update Gateway to send 'file_path' if it tracks it? 
        # Actually, the chatbot implementation sends 'message'. 
        # Ideally, we should switch to sending the PDF text directly or the path if we want state.
        
        # Let's revert to checking if a file path is passed in body:
        file_path = data.get('file_path') 
        
        if file_path and os.path.exists(file_path):
             pdf_text = extract_text_from_pdf(file_path)
             return pdf_qna(pdf_text, user_input)
        else:
            return jsonify({'response': "Please upload a document to ask questions about it."})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/process-pdf', methods=['POST'])
def process_pdf():
    try:
        data = request.get_json()
        file_path = data.get('file_path')
        
        if not file_path or not os.path.exists(file_path):
             return jsonify({'error': 'File path not provided or invalid'}), 400

        pdf_text = extract_text_from_pdf(file_path)
        
        # perform summarization
        return doc_sum(pdf_text)
    except Exception as e:
        app.logger.error(f"Error processing PDF: {str(e)}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/patient_querry', methods=['POST'])
def patient_querry():
    try:
        data = request.get_json()
        message = data.get('message', '')
        return predict(message)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/process-voice', methods=['POST'])
def process_voice():
    try:
        data = request.get_json()
        audio_path = data.get('audio_path')

        if not audio_path or not os.path.exists(audio_path):
            return jsonify({'error': 'Audio path not provided or invalid'}), 400
        
        # Using existing recognize_speech but passed path
        return recognize_speech(audio_path)
        
    except Exception as e:
         return jsonify({'error': str(e)}), 500


@app.route("/summarize", methods=["POST"])
def summarize_conversation():
    data = request.get_json()
    conversation = data.get("conversation")

    if not conversation:
        return jsonify({"error": "No conversation provided"}), 400
    
    summary = summarize(conversation)
    return jsonify({"summary": summary})



if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
