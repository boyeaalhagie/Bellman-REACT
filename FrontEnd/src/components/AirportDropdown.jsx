import React, { useEffect, useState } from 'react';
import Select from 'react-select'; // Import React-Select
import '../styles/AirportDropdown.css'; // Import your CSS file

function AirportDropdown({ label, onSelect }) {
    const [airports, setAirports] = useState([]);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        // Load airport data from the backend
        fetch('http://localhost:5000/api/airports')
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                // Sort airports alphabetically by NAME
                const sortedAirports = data.sort((a, b) => a.NAME.localeCompare(b.NAME));

                // Map data to options format required by React-Select
                const formattedOptions = sortedAirports.map((airport) => ({
                    value: airport.IATA,
                    label: `${airport.IATA} - ${airport.NAME}`,
                }));

                setAirports(sortedAirports);
                setOptions(formattedOptions);
            })
            .catch((err) => console.error('Failed to fetch airports:', err));
    }, []);

    return (
        <div className="dropdown-container">
            <label className="dropdown-label">{label}</label>
            <Select className="dropdown-select"
                options={options}
                placeholder="Select an airport"
                onChange={(selectedOption) => onSelect(selectedOption?.value)}
                isClearable // Allow clearing the selection
                isSearchable // Enable search functionality
            />
        </div>
    );
}

export default AirportDropdown;
