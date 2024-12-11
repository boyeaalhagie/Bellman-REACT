const { calculateDistance } = require('./distanceCalculator');
const airports = require('../data/airports.json');

// Validate if `airports` is an array
if (!Array.isArray(airports)) {
    throw new Error("Invalid data: 'airports' should be an array.");
}

// Build the graph as an adjacency list
const graph = {};

// Add nodes and edges to the graph
airports.forEach((source) => {
    graph[source.IATA] = [];
    airports
        .filter((destination) => source.IATA !== destination.IATA)
        .forEach((destination) => {
            const distance = calculateDistance(
                source.LAT,
                source.LONG,
                destination.LAT,
                destination.LONG
            );
            graph[source.IATA].push({ destination: destination.IATA, weight: distance });
        });
});

// Bellman-Ford algorithm to find multiple routes
function findAllPaths(start, end) {
    if (!graph[start] || !graph[end]) {
        // console.timeEnd('findAllPaths');
        return {
            error: `Invalid nodes: Start '${start}' or End '${end}' not found in the graph.`,
        };
    }

    const distances = {};
    const predecessors = {};
    const nodes = Object.keys(graph);

    // sTEP1: Initialize distances and predecessors
    // console.log('Step 1: Initialize distances and predecessors');
    nodes.forEach((node) => {
        distances[node] = Infinity;
        predecessors[node] = null;
        // console.log(`Initialized distance for ${node}: ${distances[node]}`);
        // console.log(`Initialized predecessor for ${node}: ${predecessors[node]}`);
    });
    distances[start] = 0;

    let updated;

    // Step 2: Relax edges repeatedly
    // console.log('Step 2: Relax edges repeatedly');
    for (let i = 0; i < nodes.length - 1; i++) {
        updated = false;

        for (const node of nodes) {
            graph[node].forEach(({ destination, weight }) => {
                if (distances[node] + weight < distances[destination]) {
                    distances[destination] = distances[node] + weight;
                    predecessors[destination] = node;
                    updated = true;
                    // console.log(`Updated distance for ${destination}: ${distances[destination]}`);
                }
            });
        }
        // Terminate early if no updates occurred
        if (!updated) break;
    }


    // If the destination is unreachable
    if (distances[end] === Infinity) {
        return { distance: null, path: null, routes: [] };
    }

    /// Step 3: Build the shortest path and extract alternative routes
    // console.log('Step 3: Build the shortest path and extract alternative routes');
    const shortestPath = [];
    let current = end;
    while (current) {
        shortestPath.unshift(current);
        current = predecessors[current];
    }
    // console.log(`Shortest Path: ${shortestPath}`);

    // Extract alternative routes with exactly one connecting flight
    const alternativeRoutes = [];
    graph[start].forEach(({ destination: connecting, weight: startToConnecting }) => {
        if (graph[connecting]) {
            const connectingToEnd = graph[connecting].find(
                ({ destination }) => destination === end
            );

            if (connectingToEnd) {
                const fullRoute = [start, connecting, end];
                const totalDistance = startToConnecting + connectingToEnd.weight;

                alternativeRoutes.push({
                    route: fullRoute,
                    distance: totalDistance,
                });
            }
        }
    });

    return {
        shortestDistance: distances[end],
        shortestPath,
        alternativeRoutes,
    };
}

// Calculate user-defined route distance
function calculateUserRouteDistance(userRoute) {
    const route = userRoute.split(",");
    let totalDistance = 0;

    for (let i = 0; i < route.length - 1; i++) {
        const start = route[i];
        const end = route[i + 1];

        const edge = graph[start].find(edge => edge.destination === end);
        if (edge) {
            totalDistance += edge.weight;
        } else {
            return null; 
        }
    }

    return totalDistance;
}

module.exports = { findAllPaths, calculateUserRouteDistance };
