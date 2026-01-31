// src/ChatPage.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { API_BASE_URL } from "../../config/constant";

const socket = io(API_BASE_URL);

function ChatPage({ username }) {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    socket.on('chatMessage', (message) => {
      setMessages([...messages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [messages]);

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    const message = {
      user: username,
      text: messageInput
    };
    socket.emit('chatMessage', message);
    setMessageInput('');
  };

  return (
    <div>
      <h2>Welcome, {username}!</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user}: </strong>
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleMessageSubmit}>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Enter your message..."
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatPage;
