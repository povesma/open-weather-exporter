'use strict';

require('dotenv').config();
const express = require('express');
const axios = require('axios');

const PORT = '9100';
const HOST = '0.0.0.0';
const API_KEY = process.env.OPEN_WEATHER_API_KEY || 'api_key_required';
const API_LOCATION_ID = process.env.OPEN_WEATHER_LOCATION_ID || 'location_id_required';
const API_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather`;
const API_STRING = `${API_ENDPOINT}?id=${API_LOCATION_ID}&units=metric&appid=${API_KEY}`;
const app = express();

var SCRAPE_INTERVAL = null; // If number - then call OpenWeather API with this interval, and respond to /metrics with a cached values


// Fetches data from OpenWeather API
async function fetchWeatherData() {
  const response = await axios.get(API_STRING);
  return response.data;
}


// Formats a single sensor reading
function formatOpenMetricsSensor(sensor) {
  let output = '';
  output += `#HELP ${sensor.name} ${sensor.description}\n`;
  output += `#TYPE ${sensor.name} ${sensor.type}\n`;
  output += `${sensor.name}{location="${sensor.source}"} ${sensor.value}\n`;
  return output;
};


// Formats OpenWeather data to Open Metrics for Prometheus
function formatOpenMetrics(data) {
  let output = '';
  let sensor = {};
  
  // Air Tempearture
  sensor = {
    name: 'sensor_air_temperature',
    description: 'Air temperature in degrees Celsius (˚C)',
    type: 'gauge',
    source: 'OpenWeather',
    value: data.main.temp
  };
  output += formatOpenMetricsSensor(sensor);
  
  // Air Relative humidity
  sensor = {
    name: 'sensor_air_relative_humidity',
    description: 'Air relative humidity in percentage (%H)',
    type: 'gauge',
    source: 'OpenWeather',
    value: data.main.humidity
  };
  output += formatOpenMetricsSensor(sensor);
  
  // Air Pressure
  sensor = {
    name: 'sensor_air_pressure',
    description: 'Air pressure in hectopascals (hPa)',
    type: 'guage',
    source: 'OpenWeather',
    value: data.main.pressure
  };
  output += formatOpenMetricsSensor(sensor);
  
  return output;
}


// Converts readings from OpenWeather API to a sipler JSON Output
function formatJsonMetrics(data) {
  const sensorData = {
    air_temperature: data.main.temp,
    air_relative_humidity: data.main.humidity,
    air_pressure: data.main.pressure
  };
  return sensorData;
}


// Handles requests to home page
app.get('/', (req, res, next) => {
  res.send('OpenWeatherMap.org Exporter for Prometheus');
});


// Returns Open Metrics formatted data for Prometheus
app.get('/metrics', async (req, res, next) => {
  try {
    const data = await fetchWeatherData();
    const metrics = formatOpenMetrics(data)
    res.status(200).send(metrics);
  } catch (err) {
    return next(err);
  }
});


// Returns JSON formated data
app.get('/sensors', async (req, res, next) => {
  try {
    const data = await fetchWeatherData();
    const metrics = formatJsonMetrics(data)
    res.status(200).send(metrics);
  } catch (err) {
    return next(err);
}});


// Handles 404 errors
app.use((req, res, next) => {
  res.status(404).send('404 Not found');
})


// Handles thrown errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('500 Server error');
})

// Loads configuration:
// 1. Cities IDs
// 2. Cities names / Countries
// 3. API Key
// 4. Scrape interval

function config() {

}

config();

process.on('SIGINT', () => {
  console.info("Interrupted")
  process.exit(0)
});


// Start listening for requests
app.listen(PORT, HOST);
console.log(`OpenWeather Exporter listening on http://${HOST}:${PORT}`);
