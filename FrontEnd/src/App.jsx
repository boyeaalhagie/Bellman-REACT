import React, { useState, useEffect } from 'react';
import { LoadScript } from '@react-google-maps/api';
import AirportDropdown from './components/AirportDropdown';
import RouteForm from './components/RouteForm';
import Map from './components/Map';
import ResultTable from './components/ResultTable';
import airports from './data/airports.json'; // Import airport data for coordinates
import './style.css';

function Navbar() {
    return (
        <nav className="navbar">
        </nav>
    );
}

function App() {
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [routeResults, setRouteResults] = useState(null);
    const [selectedRouteCoordinates, setSelectedRouteCoordinates] = useState(null);

    const handleRouteSelect = (routeCoordinates) => {
        setSelectedRouteCoordinates(routeCoordinates);
    };

    // Extract user's route
    const userRouteCoordinates = routeResults?.userRoute?.route?.map((code) => {
        const airport = airports.find((airport) => airport.IATA === code);
        return airport
            ? { lat: airport.LAT, lng: airport.LONG }
            : null;
    }).filter(Boolean); 

    return (
        <>
        <Navbar />
            <div className="container">
                <div className="form-section">
                    <AirportDropdown label="Starting Airport" onSelect={setStart} />
                    <AirportDropdown label="Destination Airport" onSelect={setEnd} />
                    <RouteForm
                        start={start}
                        end={end}
                        onResults={(results) => {
                            setRouteResults(results);
                            setSelectedRouteCoordinates(null);
                        }}
                    />
                </div>
                <div className="result-section">
                    {routeResults && (
                        <ResultTable 
                            results={routeResults} 
                            onRouteSelect={handleRouteSelect} 
                        />
                    )}
                </div>
                
            </div>
            <LoadScript googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY}>
                {(selectedRouteCoordinates || routeResults?.userRoute?.route) && (
                    <Map 
                        route={selectedRouteCoordinates || 
                            routeResults.userRoute.route.map((code) => {
                                const airport = airports.find((airport) => airport.IATA === code);
                                return airport
                                    ? { lat: airport.LAT, lng: airport.LONG }
                                    : null;
                            }).filter(Boolean)
                        } 
                    />
                )}
            </LoadScript>
        </>
    );
}

export default App;