"use client"; // Enables client-side rendering for this component

// Import necessary hooks and types from React
import { useState, ChangeEvent, FormEvent } from "react";

// Import custom UI components from the UI directory
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Import icons from the Lucide React library
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";
import { fetchLocation } from "@/lib/utils";

// Default export of the WeatherWidgetComponent function
export default function WeatherWidget() {
  // State hooks for managing location input, weather data, error messages, and loading state
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [exactLocation, setExactLocation] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to handle the search form submission
  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedLocation = searchLocation.trim();
    if (trimmedLocation === "") {
      setError("Please enter a valid location."); // Set error message if location input is empty
      setWeather(null); // Clear previous weather data
      return;
    }

    setIsLoading(true); // Set loading state to true
    setError(null); // Clear any previous error messages

    try {
      const location = await fetchLocation(trimmedLocation); // Fetch the exact location using the geocoding API

      if (location.error || !location.fullLocationName) {
        setError(location.error); // Set error message if location fetch fails
        setWeather(null); // Clear previous weather data
        return;
      }
      const { fullLocationName, latitude, longitude, time } = location; // Destructure latitude, longitude, and time from the location object

      // Set the name in the typed space to be the full location name including country
      setSearchLocation(fullLocationName);

      // Fetch weather data from the weather API
      const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${latitude}&lon=${longitude}&dt=${time}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=metric`
      );
      if (response.ok) {
        const weather = await response.json();

        const temperature = weather.data[0].temp;
        const description = weather.data[0].weather[0].description;
        const location = "";

        const weatherData: WeatherData = {
          temperature,
          description,
          location,
          unit: "C", // Unit for temperature
        };
        setWeather(weatherData); // Set the fetched weather data
      } else {
        const message = await response.json();
        setError(message.error.message); // Set error message
        setWeather(null); // Clear previous weather data
        // console.error(message.error.message);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError(String(error)); // Set error message
      setWeather(null); // Clear previous weather data
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  // Function to get a temperature message based on the temperature value and unit
  function getTemperatureMessage(temperature: number, unit: string): string {
    if (unit === "C") {
      if (temperature < 0) {
        return `It's freezing at ${temperature}°C! Bundle up!`;
      } else if (temperature < 10) {
        return `It's quite cold at ${temperature}°C. Wear warm clothes.`;
      } else if (temperature < 20) {
        return `The temperature is ${temperature}°C. Comfortable for a light jacket.`;
      } else if (temperature < 30) {
        return `It's a pleasant ${temperature}°C. Enjoy the nice weather!`;
      } else {
        return `It's hot at ${temperature}°C. Stay hydrated!`;
      }
    } else {
      // Placeholder for other temperature units (e.g., Fahrenheit)
      return `${temperature}°${unit}`;
    }
  }

  // Function to get a weather message based on the weather description
  function getWeatherMessage(description: string): string {
    switch (description.toLowerCase()) {
      case "sunny":
        return "It's a beautiful sunny day!";
      case "partly cloudy":
        return "Expect some clouds and sunshine.";
      case "cloudy":
        return "It's cloudy today.";
      case "overcast":
        return "The sky is overcast.";
      case "rain":
        return "Don't forget your umbrella! It's raining.";
      case "thunderstorm":
        return "Thunderstorms are expected today.";
      case "snow":
        return "Bundle up! It's snowing.";
      case "mist":
        return "It's misty outside.";
      case "fog":
        return "Be careful, there's fog outside.";
      default:
        return description; // Default to returning the description as-is
    }
  }

  // Function to get a location message based on the current time
  function getLocationMessage(location: string): string {
    const currentHour = new Date().getHours();
    const isNight = currentHour >= 18 || currentHour < 6; // Determine if it's night time

    return ` ${location} ${isNight ? "at Night" : "During the Day"}`;
  }

  // JSX return statement rendering the weather widget UI
  return (
    <div className="flex justify-center items-center h-screen">
      {/* Center the card within the screen */}
      <Card className="w-full max-w-md mx-auto text-center">
        {/* Card header with title and description */}
        <CardHeader>
          <CardTitle>Weather Widget</CardTitle>
          <CardDescription>
            Search for the current weather conditions in your city.
          </CardDescription>
        </CardHeader>
        {/* Card content including the search form and weather display */}
        <CardContent>
          {/* Form to input and submit the location */}
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Enter a city name"
              value={searchLocation}
              onChange={
                (e: ChangeEvent<HTMLInputElement>) =>
                  setSearchLocation(e.target.value) // Update location state on input change
              }
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Search"}{" "}
              {/* Show "Loading..." text while fetching data */}
            </Button>
          </form>
          {/* Display error message if any */}
          {error && <div className="mt-4 text-red-500">{error}</div>}
          {/* Display weather data if available */}
          {weather && (
            <div className="mt-4 grid gap-2">
              {/* Display temperature message with icon */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <ThermometerIcon className="w-6 h-6" />
                  {getTemperatureMessage(weather.temperature, weather.unit)}
                </div>
              </div>
              {/* Display weather description message with icon */}
              <div className="flex items-center gap-2">
                <CloudIcon className="w-6 h-6 " />
                <div>{getWeatherMessage(weather.description)}</div>
              </div>
              {/* Display location message with icon */}
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-6 h-6 " />
                <div>{getLocationMessage(weather.location)}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
