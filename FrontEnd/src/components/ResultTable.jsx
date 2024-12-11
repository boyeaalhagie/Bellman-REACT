import React, { useState } from 'react';
import '../styles/ResultTable.css';
import airports from '../data/airports.json';
import topAirports from '../data/top_airports.json';

function ResultTable({ results, onRouteSelect }) {
    const [expandedRow, setExpandedRow] = useState(null);
    const [filterByTopAirports, setFilterByTopAirports] = useState(false);

    if (!results) return null;

    const { userRoute, shortestPath, shortestDistance, alternativeRoutes } = results;

    const formatRouteIATA = (route) => route.join(' -> ');

    const filterRoutes = (routes) => {
        if (!filterByTopAirports) return routes;

        return routes.filter((route) => {
            const connectingFlights = route.rawRoute.slice(1, -1);
            return connectingFlights.every((code) =>
                topAirports.some((airport) => airport.IATA === code)
            );
        });
    };

    const userRouteRow = userRoute
        ? {
              route: formatRouteIATA(userRoute.route),
              distance: userRoute.distance,
              rawRoute: userRoute.route,
          }
        : null;

    const shortestPathRow = {
        route: formatRouteIATA(shortestPath),
        distance: shortestDistance,
        rawRoute: shortestPath,
    };

    const alternativeRouteRows = alternativeRoutes
        .sort((a, b) => a.distance - b.distance)
        .map((route) => ({
            route: formatRouteIATA(route.route),
            distance: route.distance,
            rawRoute: route.route,
        }));

    const allRows = [
        ...(userRouteRow ? [userRouteRow] : []),
        shortestPathRow,
        ...alternativeRouteRows,
    ];

    const tableRows = filterRoutes(allRows);

    const toggleRow = (index) => {
        setExpandedRow(expandedRow === index ? null : index);
        
        // Get route coordinates for the selected row
        const selectedRow = tableRows[index];
        const routeCoordinates = selectedRow.rawRoute.map((code) => {
            const airport = airports.find((airport) => airport.IATA === code);
            return airport
                ? { lat: airport.LAT, lng: airport.LONG }
                : null;
        }).filter(Boolean);

        // Call the onRouteSelect prop with the route coordinates
        onRouteSelect(routeCoordinates);
    };

    return (
        <div className="result-table">
            <h2>All Route Results</h2>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Route</th>
                            <th>Distance (miles)</th>
                        </tr>
                        <tr>
                            <th colSpan="2">
                                <div className="filters">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={filterByTopAirports}
                                            onChange={(e) => setFilterByTopAirports(e.target.checked)}
                                        />
                                        Show Only Airports With The Most Connecting Flights
                                    </label>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableRows.map((row, index) => (
                            <React.Fragment key={index}>
                                <tr onClick={() => toggleRow(index)}>
                                    <td>{row.route}</td>
                                    <td>{row.distance.toFixed(2)}</td>
                                </tr>
                                {expandedRow === index && row.rawRoute.length > 2 && (
                                    <tr>
                                        <td colSpan="2">
                                            <div className="details">
                                                <strong>Connecting Flight:</strong>
                                                <ul>
                                                    {row.rawRoute.slice(1, -1).map((code, idx) => {
                                                        const airport = airports.find(
                                                            (airport) => airport.IATA === code
                                                        );
                                                        return (
                                                            <li key={idx}>
                                                                {airport
                                                                    ? `${code} - ${airport.NAME}, ${airport.CITY}, ${airport.STATE}`
                                                                    : `${code} - Unknown Airport`}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ResultTable;