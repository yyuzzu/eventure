import React, { useState, useEffect } from "react";
import "./App.css";
import LoginSignUp from './LoginSignUp'; // Import LoginSignup component
import Hero from "./Hero";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleAuth = () => {
    setIsLoggedIn(!isLoggedIn);
  };
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `https://app.ticketmaster.com/discovery/v2/events.json?apikey=bgZeooyhjB8xRqUAGK9Y764AUGGdmBdQ`
        );
        const data = await response.json();

        if (data._embedded?.events && Array.isArray(data._embedded.events)) {
          setEvents(data._embedded.events); 
        } else {
          setError("No events found.");
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setError("Error fetching events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query) {
      const filtered = events.filter((event) =>
        event.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredEvents(filtered);
      setIsDropdownOpen(true); 
    } else {
      setFilteredEvents([]);
      setIsDropdownOpen(false);
    }
  };

  const handleEventSelect = (eventUrl) => {
    window.open(eventUrl, "_blank");
    setIsDropdownOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <div>
          {/* Header */}
          <header className="header">
            <div className="logo-circle"></div>
            <div className="logo">eventure</div>
            <nav className="header-nav">
              <a href="#home">Home</a>
              <a href="#events">Events</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
            </nav>
            <div className="profile-menu">
              <img
                src="https://d28htnjz2elwuj.cloudfront.net/wp-content/uploads/2013/11/University_of_Washington_Logo.jpg"
                alt="User"
                className="profile-avatar"
              />
              <span>Username</span>
            </div>
          </header>

          {/* Hero Section */}
          <section className="hero">
            <img
              src="https://wallpaperaccess.com/full/3897907.jpg"
              alt="Background"
              className="hero-image"
            />
            <div className="search-bar-container-centered">
              <input
                type="text"
                placeholder="Search Events, Categories, Location..."
                className="search-bar-centered"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <select className="location-dropdown-centered">
                <option value="seattle">Seattle</option>
                <option value="bellevue">Bellevue</option>
              </select>
            </div>

            {/* Display Event Suggestions */}
            {isDropdownOpen && filteredEvents.length > 0 && (
              <div id="suggestions">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="suggestion-item"
                    onClick={() => handleEventSelect(event.url)}
                  >
                    <p>{event.name}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Category Section */}
          <section className="category-section">
            <h2 className="category-title">Category</h2>
            <div className="category-circles">
              {/* Categories here */}
            </div>
          </section>

          {/* Events Section */}
          <section className="events-section">
            <h2 className="category-title">Upcoming Events</h2>
            {loading ? (
              <p>Loading events...</p>
            ) : error ? (
              <p>{error}</p>
            ) : events.length === 0 ? (
              <p>No events found.</p>
            ) : (
              <div className="events-list">
                {events.map((event) => (
                  <div key={event.id} className="event-card">
                    <img
                      src={event.images?.[0]?.url || 'default-logo.png'}
                      alt={event.name || 'No title'}
                      className="event-image"
                    />
                    <h3>{event.name || 'No event name'}</h3>
                    <p>{new Date(event.dates.start.localDate).toLocaleDateString() || 'Date unavailable'}</p>
                    <p>{event._embedded.venues[0].name || 'Location unavailable'}</p>
                    <a href={event.url} target="_blank" rel="noopener noreferrer">
                      View Event
                    </a>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      ) : (
        <LoginSignUp setIsLoggedIn={setIsLoggedIn} /> // Render LoginSignup when not logged in
      )}
    </div>
  );
}

export default App;
