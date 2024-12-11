const express = require('express');
const { calculateShortestPath } = require('../controllers/routeController');
const router = express.Router();
const airportsData = require('../data/airports.json');

// Route for calculating shortest path
router.post('/calculate-shortest-path', calculateShortestPath);

// GET endpoint to fetch all airports
router.get('/airports', (req, res) => {
    res.json(airportsData); // Ensure airportsData is valid
    

});

module.exports = router;
