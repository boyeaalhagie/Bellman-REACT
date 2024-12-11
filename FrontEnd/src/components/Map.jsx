import React, { useCallback, useRef } from 'react';
import { GoogleMap, Polyline, Marker } from '@react-google-maps/api';
import airports from '../data/airports.json';

const containerStyle = {
    width: '100%',
    height: '700px',
};

function Map({ route }) {
    const mapRef = useRef(null);

    const onLoad = useCallback((map) => {
        mapRef.current = map;

        // Fit the map to the route
        if (route && route.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            route.forEach((point) => bounds.extend(point));
            map.fitBounds(bounds);
        }
    }, [route]);

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            onLoad={onLoad}
            options={{
                disableDefaultUI: true, // Removes default controls
                zoomControl: true,
                minZoom: 2,
                maxZoom: 20,
            }}
        >
            {/* Draw the route polyline in green */}
            {route && route.length > 0 && (
                <Polyline
                    path={route}
                    options={{
                        strokeColor: 'green', // Bright green color
                        strokeOpacity: 0.7,
                        strokeWeight: 5,
                    }}
                />
            )}

            {/* Add markers for the airports */}
            {route &&
                route.map((point, index) => {
                    const airport = airports.find((airport) => airport.LAT === point.lat && airport.LONG === point.lng);
                    return (
                        <Marker
                            key={index}
                            position={point}
                            label={{
                                text: airport?.IATA || (index + 1).toString(),
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '11px',
                            }}
                            title={airport?.NAME || `Airport ${index + 1}`}
                        />
                    );
                })}

            {/* Add markers for connecting flights in the user's proposed route */}
            
        </GoogleMap>
    );
}

export default Map;
