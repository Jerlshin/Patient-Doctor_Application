// src/LoginPage.js
import React, { useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    socket.emit('authenticate', username);
    socket.on('authenticated', (authenticated) => {
      if (authenticated) {
        onLogin(username);
      } else {
        setErrorMessage('Authentication failed. Please try again.');
      }
    });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          required
        />
        <button type="submit">Login</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default LoginPage;
