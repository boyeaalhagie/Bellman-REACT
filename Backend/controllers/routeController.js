const { findAllPaths, calculateUserRouteDistance } = require('../models/graphModel');

exports.calculateShortestPath = (req, res) => {

    const { start, end, userRoute } = req.body;

    if (!start || !end) {
        return res.status(400).json({ error: 'Start and end airports are required.' });
    }

    try {
        // Calculate paths
        const result = findAllPaths(start, end);

        if (result.error) {
            return res.status(404).json({ error: result.error });
        }

        // Calculate user route distance
        let userRouteDistance = null;
        if (userRoute) {
            userRouteDistance = calculateUserRouteDistance(userRoute);
        }

        // Construct response
        const response = {
            shortestPath: result.shortestPath,
            shortestDistance: result.shortestDistance,
            alternativeRoutes: result.alternativeRoutes,
        };

        // Include user route if valid
        if (userRouteDistance !== null) {
            response.userRoute = {
                route: userRoute.split(","),
                distance: userRouteDistance,
            };
        } else if (userRoute) {
            response.userRoute = {
                route: userRoute.split(","),
                distance: "Invalid route",
            };
        }

        res.json(response);
    } catch (error) {
        console.error('Error in calculateShortestPath:', error); // Log the error
        res.status(500).json({ error: 'Failed to calculate shortest path' });
    }
};
