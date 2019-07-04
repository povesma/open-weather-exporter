'use strict';

// TODOs
// =====
// Done. Setup routes and 404 error handlers
// Use ENV variables for configuration
// Function for fetching data from OpenWeatehrMap.org
// Convert data to Open Metrics
// Convert data to custom JSON format
// Export data over HTTP

const express = require('express');
const axios = require('axios');

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();

// Handles requests to home page
app.get('/', (req, res, next) => {
  res.send('OpenWeatherMap.org exporter for Prometheus');
});

// Returns Open Metrics formatted data for Prometheus
app.get('/metrics', (req, res, next) => {
  res.send('Metrics');
});

// Returns JSON formated data
app.get('/sensors', (req, res, next) => {
  return next(new Error('Could not fetch data from OpenWeatherMap.org'));
  res.send('Sensors');
});

// Handles 404 errors
app.use((req, res, next) => {
  res.status(404).send('Resource not found');
})

// Handles thrown errors
app.use((err, req, res, next) => {
  res.status(500).send(err.message);
})


app.listen(PORT, HOST);
console.log(`OpenWeather Exporter listening on http://${HOST}:${PORT}`);