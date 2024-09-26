import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Group markets by name
const groupMarketsByName = (sportsbooks) => {
    const groupedMarkets = {};

    sportsbooks.forEach(sportsbook => {
        sportsbook.odds.forEach(odd => {
            if (!groupedMarkets[odd.market]) {
                groupedMarkets[odd.market] = [];
            }
            groupedMarkets[odd.market].push({
                team: odd.name,
                price: odd.price,
                sportsbook: sportsbook.name,
            });
        });
    });

    return groupedMarkets;
};

const EventDetail = () => {
    const { id } = useParams();  // Event ID from the URL
    const [event, setEvent] = useState(null);
    const [groupedMarkets, setGroupedMarkets] = useState({});
    const [selectedMarket, setSelectedMarket] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/odds/')  // Adjust the URL to fetch odds data
            .then(response => response.json())
            .then(data => {
                const selectedGame = data.games.find(game => game.id === id);
                setEvent(selectedGame);
                setGroupedMarkets(groupMarketsByName(selectedGame.sportsbooks));
            });
    }, [id]);

    const handleMarketChange = (marketName) => {
        setSelectedMarket(marketName);
    };

    if (!event) return <div>Loading...</div>;

    return (
        <div>
            <h1>{event.teams.away.name} vs {event.teams.home.name}</h1>

            {/* Market Selection */}
            <label htmlFor="market">Select Market:</label>
            <select id="market" onChange={e => handleMarketChange(e.target.value)}>
                <option value="">Select a market</option>
                {Object.keys(groupedMarkets).map(market => (
                    <option key={market} value={market}>
                        {market}
                    </option>
                ))}
            </select>

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
                        {groupedMarkets[selectedMarket].map((market, index) => (
                            <tr key={index}>
                                <td>{market.sportsbook}</td>
                                <td>{market.team}</td>
                                <td>{market.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default EventDetail;
