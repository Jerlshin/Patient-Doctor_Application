import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from "../config/constant";

export function DoctorMessage() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Fetch doctor's message list
    axios.get(`${API_BASE_URL}/doctors/messages/fetch`)
      .then(response => {
        setMessages(response.data);
      })
      .catch(error => {
        console.error('Error fetching messages:', error);
      });
  }, []);

  return (
    <div className="message-list">
      <h2>Doctor's Message List</h2>
      {messages.map((message, index) => (
        <div
          key={index}
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            marginBottom: '10px',
            backgroundColor: message.severity === 'high' ? 'red' : message.severity === 'medium' ? 'orange' : 'yellow',
            color: message.severity === 'high' ? 'white' : 'black'
          }}
        >
          <p>{message.message}</p>
        </div>
      ))}
    </div>
  );
};

