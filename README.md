# OpenWeatherMap Exporter

A simple node.js app for exporting fetched [openweathermap.org](http://openweathermap.org) data to [Open Metrics](https://openmetrics.io/) format required by Prometheus.

The app relies on environment variables for configuration. These shoud be placed inside the .env file and passed to the container at runtime using the `--env-file` flag.

```bash
OPEN_WEATHER_API_KEY=abcdef123456890
OPEN_WEATHER_LOCATION_ID=2636439
```