import React, { useState, useEffect } from "react";

const Hero = ({ events }) => {
  const [query, setQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (query) {
      const results = events.filter(event =>
        event.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredEvents(results);
      setIsDropdownOpen(true);
    } else {
      setFilteredEvents([]);
      setIsDropdownOpen(false);
    }
  }, [query, events]);

  return (
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
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="location-dropdown-centered">
          <option value="seattle">Seattle</option>
          <option value="bellevue">Bellevue</option>
        </select>
      </div>

      {isDropdownOpen && filteredEvents.length > 0 && (
        <div id="suggestions">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="suggestion-item"
              onClick={() => window.open(event.url, "_blank")}
            >
              <p>{event.name}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;
