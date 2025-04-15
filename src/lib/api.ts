import { degToCompass } from "./utils";

// Convert free text locations into co-ordinates
export const fetchLocationPosition = async (
  location: string
): Promise<LocationData> => {
  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
  );
  try {
    if (response.ok) {
      const data = await response.json();

      const locationData = data[0]; // Assuming the first result is the most relevant

      if (locationData === undefined) {
        const error = `${location} cannot be found`;
        return {
          placename: null,
          latitude: null,
          longitude: null,
          time: null,
          error: String(error),
        }; // Return error message
      }

      const placename = `${locationData.name}, ${locationData.country}`;
      const latitude = locationData.lat; // Get latitude
      const longitude = locationData.lon; // Get longitude
      const time = Math.floor(Date.now() / 1000); // Get current time in seconds since epoch
      return { placename, latitude, longitude, time, error: null }; // Return latitude, longitude, and time
    } else {
      const message = await response.json();
      return {
        placename: null,
        latitude: null,
        longitude: null,
        time: null,
        error: message.error.message,
      }; // Return error message
    }
  } catch (error) {
    console.error("Error fetching location data:", error);
    return {
      placename: null,
      latitude: null,
      longitude: null,
      time: null,
      error: String(error),
    }; // Return error message
  }
};

// Convert co-ordinates into a nearest city location
export const fetchLocationName = async (
  latitude: number,
  longitude: number
): Promise<LocationData> => {
  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
  );

  try {
    if (response.ok) {
      const data = await response.json();

      const locationData = data[0]; // Assuming the first result is the most relevant

      if (locationData === undefined) {
        const error = `"${location}" cannot be found`;
        return {
          placename: null,
          latitude: null,
          longitude: null,
          time: null,
          error: String(error),
        }; // Return error message
      }

      const placename = `${locationData.name}, ${locationData.country}`;
      const latitude = locationData.lat; // Get latitude
      const longitude = locationData.lon; // Get longitude
      const time = null;
      return { placename, latitude, longitude, time, error: null }; // Return latitude, longitude, and time
    } else {
      const message = await response.json();
      return {
        placename: null,
        latitude: null,
        longitude: null,
        time: null,
        error: message.error.message,
      }; // Return error message
    }
  } catch (error) {
    console.error("Error fetching location data:", error);
    return {
      placename: null,
      latitude: null,
      longitude: null,
      time: null,
      error: String(error),
    }; // Return error message
  }
};

export const fetchWeatherData = async (
  latitude: number,
  longitude: number
): Promise<string | WeatherData> => {
  // NOTE need to move this into the API file
  // Fetch weather data from the weather API
  try {
    const time = Math.floor(Date.now() / 1000);
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${latitude}&lon=${longitude}&dt=${time}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=metric`
    );
    if (response.ok) {
      const weather = await response.json();
      const temperature = Math.round(weather.data[0].temp * 10) / 10; // Round to 1 decimal place
      const description = weather.data[0].weather[0].description;
      const location = "";
      const humidity = Math.round(weather.data[0].humidity);
      const windSpeed = Math.round(weather.data[0].wind_speed);
      const feelsLike = Math.round(weather.data[0].feels_like * 10) / 10;
      const windDirection = degToCompass(weather.data[0].wind_deg);

      const weatherData: WeatherData = {
        temperature,
        feelsLike,
        description,
        location,
        unit: "C", // Unit for temperature
        humidity,
        windSpeed,
        windDirection,
        time: time,
      };
      return weatherData;
    } else {
      const message = await response.json();
      return message;
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return String(error); // Return error message
  }
};
