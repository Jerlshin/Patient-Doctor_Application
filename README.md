# Smart Telemedicine & AI-Diagnostic Platform

## 🏥 Overview

The **Patient-Doctor Application** is a full-stack telemedicine platform designed to bridge the gap between patients and healthcare providers. Beyond standard video/text consultation, this application integrates a **Hybrid AI Engine** to automate triage, summarize medical consultations, and provide intelligent analysis of medical reports.

The system utilizes a **Microservices Architecture**, separating the core application logic (Node.js) from the computation-heavy AI processing (Python/Flask), ensuring scalability and real-time performance.

---

## 🚀 System Architecture

The application operates on a **Client-Server-AI** architecture comprising three main components:

1. **Frontend (React.js):** The user interface for patients and doctors.
2. **Core Backend (Node.js/Express):** Handles authentication, database management, and real-time WebSocket connections.
3. **AI Engine (Python/Flask):** A dedicated server enabling NLP tasks, voice recognition, and predictive analytics.

### Data Flow Pipeline

1. **User Action:** Patient logs in and requests a doctor.
2. **Connection:** `Socket.io` establishes a bidirectional channel for live chat.
3. **Consultation:** Messages are exchanged in real-time.
4. **AI Intervention (Optional):**
   - *Summarization:* Chat history is sent to the Python server; a Seq2Seq model returns a summary.
   - *Triage:* Patient symptoms are analyzed by a BERT classifier to predict severity.
   - *Report Analysis:* PDF reports are parsed, and a QA model answers patient queries based on the file content.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework:** React.js
- **Styling:** Bootstrap 5, Custom CSS
- **Real-time Communication:** `socket.io-client`
- **Data Visualization:** ApexCharts, React-ApexCharts
- **Calendar/Scheduling:** FullCalendar, Syncfusion Schedule, React-Calendar

### **Core Backend (API & Database)**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Communication:** Socket.io (Server-side)
- **Security/Utils:** `cors`, `multer` (File Uploads), `body-parser`

### **AI Engine (Machine Learning)**
- **Server:** Python (Flask)
- **NLP Models:** HuggingFace Transformers (BERT, DistilBERT, Seq2Seq)
- **Speech Processing:** Google Speech Recognition API
- **PDF Processing:** `PyPDF2`
- **Machine Learning:** PyTorch, NumPy, Scikit-learn

---

## 🧠 AI & ML Pipeline Details

The project distinguishes itself with a dedicated AI backend (`patient_severity.py`) handling four distinct intelligent tasks:

### 1. Medical Report Analysis (PDF Q&A)
- **Functionality:** Patients upload lab reports (PDF). The system extracts text and allows users to ask natural language questions about the results.
- **Model:** `distilbert-base-cased-distilled-squad` (Question Answering).
- **Library:** `PyPDF2` for text extraction, `transformers` for inference.

### 2. Symptom Severity Prediction (Triage)
- **Functionality:** Analyzes patient text input to classify the condition's urgency (e.g., Mild, Moderate, Severe).
- **Model:** Fine-tuned `BertForSequenceClassification`.
- **Tokenizer:** `BertTokenizerFast`.

### 3. Automatic Consultation Summarization
- **Functionality:** Converts a lengthy chat transcript between doctor and patient into a concise medical summary for records.
- **Model:** Custom Fine-tuned Seq2Seq Model (`AutoModelForSeq2SeqLM`).

### 4. Voice-to-Text Interaction
- **Functionality:** Enables hands-free query inputs via microphone.
- **Library:** `speech_recognition` (Google API).

---

## ✨ Key Features

- **User Authentication:** Secure Signup/Login for Patients (with potential extension for Doctors).
- **Doctor Discovery:** Browse doctors by profession, location, or qualification with filtering capabilities.
- **Real-Time Chat:** Instant messaging using WebSockets with "Scroll to Bottom" UX.
- **AI Chatbot Assistant:**
  - Voice-enabled querying.
  - Context-aware medical document answering.
- **Health Utilities:**
  - **BMI Calculator:** Quick health index check.
  - **Medicine Reminder:** Interactive calendar to schedule and track medication.
- **Responsive Dashboard:** Visualized health metrics and easy navigation.

---

## 📂 Project Structure

```bash
Patient-Doctor_Application/
├── Backend/                 # Server-side Logic
│   ├── index.js             # Entry point for Node.js Server (Port 4000)
│   ├── patient_severity.py  # Entry point for AI Flask Server (Port 5000)
│   ├── controller/          # API Route Controllers
│   ├── model/               # Mongoose Schemas (Doctors, Documents)
│   └── uploads/             # Storage for uploaded medical PDFs
│
├── frontend/                # Client-side Logic
│   ├── src/
│   │   ├── Component/       # Reusable UI Components (Chat, BMI, Doctors)
│   │   ├── screens/         # Page Views (Login, Signup, Home)
│   │   └── config/          # API Constants
│   └── public/              # Static Assets
```

---

## ⚡ Getting Started

### Prerequisites

- Node.js & npm installed
- Python 3.8+ & pip installed
- MongoDB installed and running locally on port 27017

### 1. Database Setup

Ensure your local MongoDB instance is running:

```bash
mongod
```

### 2. Node Backend Setup

```bash
cd Backend
npm install          # Install dependencies (express, mongoose, socket.io, etc.)
npm start            # Runs server on http://localhost:4000
```

### 3. AI Engine Setup (Python)

```bash
cd Backend
pip install flask flask-cors transformers torch numpy speechrecognition PyPDF2
python patient_severity.py   # Runs AI server on http://localhost:5000
```

**Note:** Ensure you have the model artifacts (checkpoints) in the specified directories (e.g., `Conversation_MODEL`, `QA_Model_cpu.pkl`) or update the paths in `patient_severity.py`.

### 4. Frontend Setup

```bash
cd frontend
npm install          # Install React dependencies
npm start            # Opens application at http://localhost:3000
```

---

## 🔮 Future Enhancements

- **Video Consultation:** Integrating WebRTC for face-to-face calls.
- **E-Prescriptions:** Generating digital prescriptions based on the AI summary.
- **Payment Gateway:** Integration for booking consultation slots.
- **Cloud Deployment:** Dockerizing services for deployment on AWS/Azure.