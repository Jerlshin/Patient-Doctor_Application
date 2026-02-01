import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Nav } from "./components/Nav";
import { Home } from './pages/Home';
import { BMI } from './pages/BMI';
import { Doctors } from './pages/Doctors';
import { Reminder } from './pages/Reminder';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Chatbot } from './pages/Chatbot';
import { MainChat } from './pages/Chat/Main';
import { Messaging } from './pages/Message';
import { DoctorMessage } from './pages/DoctorMessage';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/Dashboard/PatientDashboard';
import DoctorDashboard from './pages/Dashboard/DoctorDashboard';

import SessionManager from './components/SessionManager';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <SessionManager />
        <Toaster position="top-right" />
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<PatientDashboard />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/bmi" element={<BMI />} />
          <Route path="/doctor" element={<Doctors />} />
          <Route path="/doctormsg" element={<DoctorMessage />} />
          <Route path="/reminder" element={<Reminder />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/chat" element={<MainChat />} />
          <Route path="/message/:id" element={<Messaging />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;