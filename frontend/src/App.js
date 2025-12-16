import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import {Nav} from "./Component/Nav";
import { Home } from './Component/Home';
import { BMI } from './Component/BMI';
import { Doctors } from './Component/Doctors';
import { Reminder} from './Component/Reminder';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChatBottemp } from './Component/CharBottemp';
import { MainChat } from './Component/Chat/Main';
import { Messaging } from './Component/Message';
import { DoctorMessage } from './Component/DoctorMessage';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/bmi' element={<BMI />} />
          <Route path="/doctor" element={<Doctors />} />
          <Route path="/doctormsg" element={<DoctorMessage />} />
          <Route path="/reminder" element={<Reminder />} />
          <Route path="/chatbot" element={<ChatBottemp />} />
          <Route path="/chat" element={<MainChat />} />
          <Route path="/message/:id" element={<Messaging />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
