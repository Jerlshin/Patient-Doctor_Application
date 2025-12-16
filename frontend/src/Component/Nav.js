import "./styles.css";
import {Link} from "react-router-dom";

export function Nav(){
    return(
        <div class="container">
      <nav>
        <div class="nav__logo">MedEpoch</div>
        <ul class="nav__links">
          <li class="link">
            <Link to="/">Home</Link>
          </li>
          <li class="link">
            <Link to="/about">About Us</Link>
          </li>
          <li class="link">
            <Link to="/bmi">BMI Calculator</Link>
          </li>
          <li class="link">
            <Link to="/doctor">Doctors</Link>
          </li>
          <li class="link">
            <Link to="/doctormsg">Doctors Message</Link>
          </li>
          <li class="link">
            <Link to="/chat">Chat</Link>
          </li>
          <li class="link">
            <Link to="/chatbot">ChatBot</Link>
          </li>
          <li class="link">
            <Link to="/reminder">Reminder</Link>
          </li>
        </ul>
        <button class="btn">
        Register
        </button>
      </nav>
    </div>
    )
}