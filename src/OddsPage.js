import React, { useState, useEffect } from 'react';

const OddsPage = () => {
    const [oddsData, setOddsData] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedMarket, setSelectedMarket] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/odds/')  // Update the URL to point to your Django API
            .then(response => response.json())
            .then(data => setOddsData(data.games));
    }, []);


    const handleEventChange = (eventId) => {
        setSelectedEvent(eventId);
        setSelectedMarket(null); // Reset market selection
    };

    const handleMarketChange = (marketId) => {
        setSelectedMarket(marketId);
    };

    return (
        <div>
            <h1>Sports Betting Odds</h1>

            {/* Event Selection */}
            <label htmlFor="event">Select Event:</label>
            <select id="event" onChange={e => handleEventChange(e.target.value)}>
                <option value="">Select an event</option>
                {oddsData.map(game => (
                    <option key={game.id} value={game.id}>
                        {game.teams.away.name} vs {game.teams.home.name}
                    </option>
                ))}
            </select>

            {/* Market Selection */}
            {selectedEvent && (
                <>
                    <label htmlFor="market">Select Market:</label>
                    <select id="market" onChange={e => handleMarketChange(e.target.value)}>
                        <option value="">Select a market</option>
                        {oddsData
                            .find(game => game.id === selectedEvent)
                            .sportsbooks[0]
                            .odds.map(odd => (
                                <option key={odd.id} value={odd.id}>
                                    {odd.market}
                                </option>
                            ))}
                    </select>
                </>
            )}

            {/* Display Odds in Table */}
            {selectedMarket && (
                <table>
                    <thead>
                        <tr>
                            <th>Sportsbook</th>
                            <th>Team/Player</th>
                            <th>Odds</th>
                        </tr>
                    </thead>
                    <tbody>
                        {oddsData
                            .find(game => game.id === selectedEvent)
                            .sportsbooks.map(sportsbook => (
                                <tr key={sportsbook.id}>
                                    <td>{sportsbook.name}</td>
                                    <td>
                                        {sportsbook.odds.find(odd => odd.id === selectedMarket).name}
                                    </td>
                                    <td>
                                        {sportsbook.odds.find(odd => odd.id === selectedMarket).price}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default OddsPage;
