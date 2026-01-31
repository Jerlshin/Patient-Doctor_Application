import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Plus, Clock, Calendar as CalendarIcon, Pill } from 'lucide-react';

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
    if (!medicine || !startDate || !endDate || !time) return;
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
    <div className="flex flex-col items-center p-6 space-y-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-600">
            <Pill /> Add Medication Reminder
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
              <input type="text" value={medicine} onChange={(e) => setMedicine(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Aspirin" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <button onClick={addEvent} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors mt-2">
              <Plus size={18} /> Add Reminder
            </button>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 self-start">
            <CalendarIcon /> Schedule
          </h2>
          <div className="custom-calendar-container rounded-lg overflow-hidden border border-gray-100">
            <Calendar
              value={date}
              onChange={setDate}
              tileContent={({ date }) => isDateWithinEventRange(date) ? <div className="absolute bottom-0 left-0 w-full h-1 bg-red-400"></div> : null}
              className="border-none w-full"
              tileClassName={({ date }) => isDateWithinEventRange(date) ? 'bg-red-50 text-red-600 font-bold hover:bg-red-100' : ''}
            />
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Reminders for {date.toDateString()}</h2>
        {events.filter(e => isDateWithinEventRange(date)).length > 0 ? (
          <ul className="space-y-3">
            {events.filter(e => isDateWithinEventRange(date)).map((event, index) => (
              <li key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <Pill size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{event.medicine}</p>
                    <p className="text-sm text-gray-500">{event.startDate} - {event.endDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
                  <Clock size={16} />
                  <span className="font-medium text-sm">{event.time}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 text-gray-400">No medicine scheduled for this day.</div>
        )}
      </div>
    </div>
  );
};
