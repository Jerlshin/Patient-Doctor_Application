import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export const Reminder = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [medicine, setMedicine] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [time, setTime] = useState('');
  const [highlightedDates, setHighlightedDates] = useState([]);

  // Function to generate an array of dates between start and end date
  const getDatesBetweenDates = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= new Date(endDate)) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  // Update highlighted dates whenever events change
  useEffect(() => {
    const dates = events.reduce((accumulator, event) => {
      const datesToAdd = getDatesBetweenDates(event.startDate, event.endDate);
      return [...accumulator, ...datesToAdd];
    }, []);
    setHighlightedDates(dates);
  }, [events]);

  // Function to add event
  const addEvent = () => {
    const newEvent = { startDate, endDate, medicine, time };
    setEvents([...events, newEvent]);
    setMedicine('');
    setStartDate('');
    setEndDate('');
    setTime('');
  };

  // Function to check if a date is within any event range
  const isDateWithinEventRange = (currentDate) => {
    return events.some(event => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      return currentDate >= start && currentDate <= end;
    });
  };

  return (
    <div className="app" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="input-container" style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
        <div>
          <label>Medicine:</label>
          <input type="text" value={medicine} onChange={(e) => setMedicine(e.target.value)} />
        </div>
        <div>
          <label>Start Date:</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <label>End Date:</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div>
          <label>Time:</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
      </div>
      <button className='mb-3' onClick={addEvent}>Add Reminder</button>
      <div className="calendar-container" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <Calendar
          value={date}
          onChange={setDate}
          tileContent={({ date }) => isDateWithinEventRange(date) ? <div style={{ backgroundColor: 'rgba(255, 0, 0, 0.5)', height: '100%', width: '100%' }}></div> : null}
          calendarType="US"
        />
      </div>
      <div className="event-list">
        <h2>Events for {date.toDateString()}</h2>
        <ul>
          {events.map((event, index) => (
            <li key={index}>
              Medicine: {event.medicine} | Start Date: {event.startDate} | End Date: {event.endDate} | Time: {event.time}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
