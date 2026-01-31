import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Nav } from "./Component/Nav";
import { Home } from './Component/Home';
import { BMI } from './Component/BMI';
import { Doctors } from './Component/Doctors';
import { Reminder } from './Component/Reminder';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Chatbot } from './Component/Chatbot';
import { MainChat } from './Component/Chat/Main';
import { Messaging } from './Component/Message';
import { DoctorMessage } from './Component/DoctorMessage';
import Login from './Component/Login';
import Register from './Component/Register';
import PatientDashboard from './Component/Dashboard/PatientDashboard';
import DoctorDashboard from './Component/Dashboard/DoctorDashboard';

import SessionManager from './Component/SessionManager';

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