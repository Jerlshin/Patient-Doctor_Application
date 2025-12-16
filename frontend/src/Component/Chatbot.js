import React, { useState } from 'react';
import axios from 'axios';
import styles from "./Chatbot.module.css"

export const ChatBottemp = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [recording, setRecording] = useState(false);
  const [blob, setBlob] = useState(null);
  const [file, setFile] = useState(null);

  const sendMessage = async () => {
    if (recording) return; // Prevent sending while recording

    const newMessage = { role: 'user', content: userInput };
    setMessages([...messages, newMessage]);
    setUserInput('');

    try {
      if (blob) {
        const formData = new FormData();
        formData.append('audio', blob);
        const response = await axios.post('http://localhost:5000/voice-message', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        const responseData = response.data.response;
        const botResponse = { role: 'system', content: responseData };
        setMessages(prevMessages => [...prevMessages, botResponse]);
        setBlob(null); // Clear blob after processing
      } else if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('user_input', userInput); // Send userInput along with the file

        const response = await axios.post('http://localhost:5000/upload-pdf', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        const responseData = response.data.response;
        const botResponse = { role: 'system', content: responseData };
        setMessages(prevMessages => [...prevMessages, botResponse]);
        setFile(null); // Clear file after processing
      } else {
        const response = await axios.post('http://localhost:5000/query', { message: userInput });
        const responseData = response.data.response;
        const botResponse = { role: 'system', content: responseData };
        setMessages(prevMessages => [...prevMessages, botResponse]);
      }
    } catch (error) {
      alert('Error sending message:', error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const startRecording = async () => {
    setRecording(!recording); // Toggle recording state on button click
    if (!recording) return; // Exit if not starting recording

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
    }
  };

  return (
    <div className={styles.chatcontainer}>
      <div className={styles.chatmessages}>
        {messages.map((message, index) => (
          <div key={index} className={`${styles.message} ${message.role === 'user' ? styles.userMessage : styles.systemMessage}`}>
            {message.content}
          </div>
        ))}
      </div>
      <div className={styles.inputcontainer}>
        <button onClick={startRecording}>
          {recording ? 'Stop Recording' : 'Record Voice'}
        </button>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type a message..."
        />
        <input type="file" onChange={handleFileChange} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};
