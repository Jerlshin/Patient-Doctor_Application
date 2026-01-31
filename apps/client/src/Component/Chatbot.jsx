import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from "../config/constant";
import { Mic, Send, Paperclip, X, FileText, Loader2, StopCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Hello! I am your AI medical assistant. How can I help you today?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [recording, setRecording] = useState(false);
  const [blob, setBlob] = useState(null);
  const [file, setFile] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const API_URL = `${API_BASE_URL}/doctors/ai`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if ((!userInput.trim() && !blob && !file) || isLoading) return;

    const newMessage = {
      role: 'user',
      content: userInput,
      file: file ? file.name : null,
      audio: blob ? 'Voice Message' : null
    };

    setMessages(prev => [...prev, newMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      let responseData;
      let newFilePath = filePath;

      if (blob) {
        const formData = new FormData();
        formData.append('audio', blob);
        const response = await axios.post(`${API_URL}/voice-message`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        responseData = response.data.response || response.data.message;
        setBlob(null);
      } else if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('user_input', userInput);

        const response = await axios.post(`${API_URL}/upload-pdf`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        responseData = response.data.response;
        if (response.data.file_path) {
          newFilePath = response.data.file_path;
          setFilePath(newFilePath);
        }
        setFile(null);
      } else {
        const payload = { message: userInput };
        if (filePath) payload.file_path = filePath;

        const response = await axios.post(`${API_URL}/query`, payload);
        responseData = response.data.response;
      }

      setMessages(prev => [...prev, { role: 'system', content: responseData }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'system', content: "I'm sorry, I encountered an error due to server issues." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const startRecording = async () => {
    setRecording(!recording);
    if (!recording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        setRecording(false);
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        setBlob(audioBlob);
      };
      recorder.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setRecording(false);
      alert("Microphone access denied or not available.");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mt-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 shrink-0">
        <h2 className="text-white text-lg font-semibold flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          AI Medical Assistant
        </h2>
        <p className="text-blue-100 text-sm mt-1">Ask me about your health or upload medical reports.</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${msg.role === 'user'
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
              }`}>

              {/* Attachments */}
              {msg.file && (
                <div className="flex items-center gap-2 mb-2 bg-white/10 p-2 rounded text-sm border border-white/20">
                  <FileText size={16} />
                  <span>{msg.file}</span>
                </div>
              )}
              {msg.audio && (
                <div className="flex items-center gap-2 mb-2 bg-white/10 p-2 rounded text-sm border border-white/20">
                  <Mic size={16} />
                  <span>Voice Message</span>
                </div>
              )}

              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-200 flex items-center gap-2 text-gray-500">
              <Loader2 size={18} className="animate-spin" />
              <span>Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 shrink-0">
        {/* Preview Area */}
        <AnimatePresence>
          {(file || blob) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex gap-2 mb-3"
            >
              {file && (
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-sm text-gray-700">
                  <FileText size={14} />
                  <span className="max-w-[150px] truncate">{file.name}</span>
                  <button onClick={() => setFile(null)} className="hover:text-red-500"><X size={14} /></button>
                </div>
              )}
              {blob && (
                <div className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-full text-sm text-red-700 border border-red-100">
                  <Mic size={14} />
                  <span>Recording Ready</span>
                  <button onClick={() => setBlob(null)} className="hover:text-red-500"><X size={14} /></button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-end gap-2 relative">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="application/pdf"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Upload PDF"
          >
            <Paperclip size={22} />
          </button>

          <div className="flex-1 relative">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type a message..."
              className="w-full bg-gray-100 border-0 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all text-gray-700 resize-none max-h-32"
              rows="1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
          </div>

          <AnimatePresence mode="wait">
            {!userInput && !file && !blob ? (
              <motion.button
                key="record"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                onClick={startRecording}
                className={`p-3 rounded-full transition-all ${recording
                  ? 'bg-red-50 text-red-600 ring-2 ring-red-200'
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
              >
                {recording ? <StopCircle size={24} className="animate-pulse" /> : <Mic size={22} />}
              </motion.button>
            ) : (
              <motion.button
                key="send"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                onClick={sendMessage}
                disabled={isLoading}
                className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
