# OpenWeatherMap Exporter

A simple node.js app for exporting fetched [openweathermap.org](http://openweathermap.org) data to [Open Metrics](https://openmetrics.io/) format required by Prometheus.

The app relies on environment variables for configuration. These shoud be placed inside the .env file and passed to the container at runtime using the `--env-file` flag.

```bash
OPEN_WEATHER_API_KEY=abcdef123456890
OPEN_WEATHER_LOCATION_ID=2636439
SCRAPE_INTERVAL=0 | sec # will fetch from OpenWeatherMap API every $sec seconds
```

Location IDs can be found here: http://bulk.openweathermap.org/sample/city.list.json.gz

**To build**, you need the Docker environment installed. 

```bash
docker image build -t <username>/open-weather-exporter .
```

**To run** the container:

```bash
docker container run --detach --publish 9100:9100 --env-file .env <username>/open-weather-exporter 
```

**To test** the installation:
```bash
curl localhost:9100/metrics
```

```
#HELP sensor_air_temperature Air temperature in degrees Celsius (˚C)
#TYPE sensor_air_temperature gauge
sensor_air_temperature{location="OpenWeather"} 18.62
#HELP sensor_air_relative_humidity Air relative humidity in percentage (%H)
#TYPE sensor_air_relative_humidity gauge
sensor_air_relative_humidity{location="OpenWeather"} 77
#HELP sensor_air_pressure Air pressure in hectopascals (hPa)
#TYPE sensor_air_pressure gauge
sensor_air_pressure{location="OpenWeather"} 1027
```

# Change plan

1. Enable city by name / country
1. Enable multi city config, respectively add a"local" label to the metrics
1. Enable port configuration
1. Enable cached responses / scrape Openweather API with an interval - DONE
1. Enable temperature C / F switch
1. Enable ctrl+c stop - DONE
