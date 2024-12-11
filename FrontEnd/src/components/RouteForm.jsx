import React, { useState } from 'react';
import { calculateShortestPath } from '../utils/api';
import '../styles/RouteForm.css';
function RouteForm({ start, end, onResults }) {
    const [userRoute, setUserRoute] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!start || !end) {
            alert('Please select both start and end airports.');
            return;
        }
        console.log('User Route:', userRoute);
        console.log('Start:', start);
        console.log('End:', end);
        calculateShortestPath(start, end, userRoute)
            .then((data) => onResults(data))
            .catch((err) => console.error('Error calculating path', err));
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='form-container'>
                <div style={{ marginBottom: '10px' }}></div>
                <label className="form-label">Enter Your Proposed Route (comma-separated):</label>
                {/* add a style margin */}
                <div style={{ marginBottom: '10px' }}></div>
                <input
                    type="text"
                    value={userRoute}
                    onChange={(e) => setUserRoute(e.target.value)}
                    placeholder="e.g., ATL,DFW,LAX"
                    className="form-input"
                />
            </div>
            
            <div className='form-button-container'>
                <button type="submit" className="form-button">Validate Route</button>
            </div>
        </form>
    );
}

export default RouteForm;
