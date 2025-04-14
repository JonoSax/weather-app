# Weather App

This project is a weather application that allows users to search for current weather conditions based on city names. It utilizes the OpenWeatherMap API to fetch weather data and Mapbox for displaying geographical information.

## Features

- Search for weather information by city name.
- Display current temperature, weather description, and location.
- Interactive map using Mapbox to allow you to perform more fine resolution weather searching.

## Technologies Used

- React: A JavaScript library for building user interfaces.
- TypeScript: A typed superset of JavaScript that compiles to plain JavaScript.
- Mapbox: A mapping library for displaying maps and geographical data.
- OpenWeatherMap API: A service for fetching weather data.

## Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```
   cd weather-app
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Get keys from [OpenWeatherMap](https://openweathermap.org/api) and [Mapbox](https://www.mapbox.com/) and create a `.env` file in the root directory with the following variables:

   ```
   NEXT_PUBLIC_WEATHER_API_KEY={openweather_api_key}
   NEXT_PUBLIC_MAPBOX_TOKEN={mapbox_api_key}
   ```

2. Start the development server:

   ```
   npm run dev
   ```

3. Open your browser and go to `http://localhost:3000` to view the application.
