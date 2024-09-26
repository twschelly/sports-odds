import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const EventList = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/odds/')  // Adjust to your Django API
            .then(response => response.json())
            .then(data => setEvents(data.games));
    }, []);

    return (
        <div>
            <h1>Upcoming Events</h1>
            <ul>
                {events.map(game => (
                    <li key={game.id}>
                        <Link to={`/event/${encodeURIComponent(game.id)}`}>
                            {game.teams.away.name} vs {game.teams.home.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventList;
