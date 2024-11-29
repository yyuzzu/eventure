import React, { useState, useEffect } from 'react';
import './App.css';
import { db } from './firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

// Eventbrite API Configuration
const EVENTBRITE_API_URL = "https://www.eventbriteapi.com/v3/events/search/";
const EVENTBRITE_API_KEY = "YOUR_EVENTBRITE_API_KEY";

// Google Calendar API Configuration
const GOOGLE_CALENDAR_API_URL = "https://www.googleapis.com/calendar/v3/calendars/primary/events";
const GOOGLE_CALENDAR_API_KEY = "YOUR_GOOGLE_CALENDAR_API_KEY";

function App() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ name: '', description: '', date: '' });
  const [eventbriteEvents, setEventbriteEvents] = useState([]);
  const [googleCalendarEvents, setGoogleCalendarEvents] = useState([]);

  // Fetch events from Firestore
  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      setEvents(querySnapshot.docs.map(doc => doc.data()));
    };
    fetchEvents();
  }, []);

  // Fetch events from Eventbrite API
  useEffect(() => {
    const fetchEventbriteEvents = async () => {
      const response = await fetch(`${EVENTBRITE_API_URL}?token=${EVENTBRITE_API_KEY}`);
      const data = await response.json();
      setEventbriteEvents(data.events || []);
    };
    fetchEventbriteEvents();
  }, []);

  // Fetch events from Google Calendar API
  useEffect(() => {
    const fetchGoogleCalendarEvents = async () => {
      const response = await fetch(`${GOOGLE_CALENDAR_API_URL}?key=${GOOGLE_CALENDAR_API_KEY}`);
      const data = await response.json();
      setGoogleCalendarEvents(data.items || []);
    };
    fetchGoogleCalendarEvents();
  }, []);

  // Handle input change for adding a new event
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prevState => ({ ...prevState, [name]: value }));
  };

  // Handle form submission to add a new event
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newEvent.name && newEvent.description && newEvent.date) {
      await addDoc(collection(db, "events"), {
        name: newEvent.name,
        description: newEvent.description,
        date: newEvent.date,
      });
      setNewEvent({ name: '', description: '', date: '' });
      alert('Event added successfully!');
    } else {
      alert('Please fill out all fields.');
    }
  };

  return (
    <div className="App">
      {/* Navigation Bar */}
      <nav className="navbar">
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#add-event">Add Event</a></li>
          <li><a href="#eventbrite">Eventbrite Events</a></li>
          <li><a href="#google-calendar">Google Calendar Events</a></li>
        </ul>
      </nav>

      <h1>Welcome to Eventure</h1>
      
      {/* Add Event Form */}
      <form onSubmit={handleSubmit} className="add-event-form" id="add-event">
        <h2>Add New Event</h2>
        <input
          type="text"
          name="name"
          placeholder="Event Name"
          value={newEvent.name}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Event Description"
          value={newEvent.description}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="date"
          value={newEvent.date}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Event</button>
      </form>

      {/* Display Firestore Events */}
      <div className="event-list" id="home">
        <h2>Our Events</h2>
        {events.length > 0 ? (
          <ul>
            {events.map((event, index) => (
              <li key={index} className="event-item">
                <h3>{event.name}</h3>
                <p>{event.description}</p>
                <p><strong>Date:</strong> {event.date}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No events found</p>
        )}
      </div>

      {/* Display Eventbrite Events */}
      <div className="event-list" id="eventbrite">
        <h2>Eventbrite Events</h2>
        {eventbriteEvents.length > 0 ? (
          <ul>
            {eventbriteEvents.map((event, index) => (
              <li key={index} className="event-item">
                <h3>{event.name.text}</h3>
                <p>{event.description.text}</p>
                <p><strong>Date:</strong> {new Date(event.start.local).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No events found</p>
        )}
      </div>

      {/* Display Google Calendar Events */}
      <div className="event-list" id="google-calendar">
        <h2>Google Calendar Events</h2>
        {googleCalendarEvents.length > 0 ? (
          <ul>
            {googleCalendarEvents.map((event, index) => (
              <li key={index} className="event-item">
                <h3>{event.summary}</h3>
                <p>{event.description}</p>
                <p><strong>Date:</strong> {new Date(event.start.dateTime || event.start.date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No events found</p>
        )}
      </div>
    </div>
  );
}

export default App;
