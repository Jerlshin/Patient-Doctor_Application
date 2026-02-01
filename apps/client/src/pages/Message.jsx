import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams hook
import { API_BASE_URL } from "../config/constant";

export function Messaging() {
  const [message, setMessage] = useState('');
  const [doctorData, setDoctorData] = useState(null);
  const { id } = useParams(); // Get ID from URL params

  useEffect(() => {
    // Fetch doctor data for the specified ID
    console.log(id);
    axios.get(`${API_BASE_URL}/doctors/message/${id}`)
      .then(response => {
        setDoctorData(response.data);
      })
      .catch(error => {
        console.log('Error fetching doctor data:', error);
      });
  }, [id]); // Run effect whenever ID changes

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send message to Flask server
      const response = await axios.post('http://localhost:5000/patient_querry', { message });
      console.log('Response from server:', response.data.response);

      // Update message schema in MongoDB
      await axios.post('http://localhost:4000/doctors/message/write', { severity: response.data.response, message: message });
      console.log('Message written to MongoDB successfully.');

      // Reset input field after sending message
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="container">
      {doctorData ? (
        <div className="row">
          <div className="col-md-6">
            <img src={doctorData.image} alt="Doctor" />
          </div>
          <div className="col-md-6">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="message">Message:</label>
                <input
                  type="text"
                  className="form-control"
                  id="message"
                  value={message}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Send</button>
            </form>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
