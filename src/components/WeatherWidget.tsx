"use client"; // Enables client-side rendering for this component

// Import necessary hooks and types from React
import { useState, ChangeEvent, FormEvent, useEffect } from "react";

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
import { setExactLocation } from "@/reducer/locationReducer";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/reducer/locationReducer"; // ensure this path matches your store file

// Import icons from the Lucide React library
import {
  CloudIcon,
  Compass,
  Droplet,
  MapPinIcon,
  Shirt,
  ThermometerIcon,
  Wind,
} from "lucide-react";
import { fetchLocationPosition, fetchWeatherData } from "@/lib/api";

// Default export of the WeatherWidgetComponent function
export default function WeatherWidget() {
  // State hooks for managing location input, weather data, error messages, and loading state

  // NOTE we should be able to read this from localStorage
  const [searchLocation, setSearchLocation] = useState<string>("");

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const exactLocation = useSelector((state: RootState) => state.exactLocation);

  // Everytime the placename redux state changes, update the weather widget
  useEffect(() => {
    if (exactLocation.placename) {
      setSearchLocation(exactLocation.placename);
      updateWeatherForecast(exactLocation.latitude, exactLocation.longitude);
    }
  }, [exactLocation]);

  useEffect(() => {
    console.log(searchLocation);
  }, [searchLocation]);

  // When the user searches for a placename, get the exact location data
  const handleSearch = async (location: string) => {
    const locationData = await fetchLocationPosition(location);
    if (locationData.error || !locationData.placename) {
      setError(locationData.error);
      setWeather(null);
    }
    dispatch(
      setExactLocation({
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        placename: locationData.placename,
      })
    );
  };

  // Function to handle the search form submission
  const updateWeatherForecast = async (
    latitude: number | null,
    longitude: number | null
  ) => {
    if (!latitude || !longitude) {
      return;
    }

    setIsLoading(true); // Set loading state to true
    setError(null); // Clear any previous error messages

    const weatherResult = await fetchWeatherData(latitude, longitude);

    if (typeof weatherResult === "string") {
      console.error("Error fetching weather data:", error);
      setError(weatherResult); // Set error message
      setWeather(null); // Clear previous weather data
    } else {
      setWeather(weatherResult); // Set the fetched weather data
    }
    setIsLoading(false);
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
        return description.replace(/\b\w/g, (l) => l.toUpperCase()); // Default to returning the description as-is
    }
  }

  // Function to get a location message based on the current time
  function getLocationMessage(locationLight: LocationLight): string {
    const { sunrise, sunset } = locationLight;
    const time = Math.floor(Date.now() / 1000);
    let isNight = null;
    if (time < sunset && time > sunrise) {
      isNight = false;
    } else {
      isNight = true;
    }

    return `${isNight ? "Currently Night-time" : "Currently Day-time"}`;
  }

  // JSX return statement rendering the weather widget UI
  return (
    <div
      className="flex justify-center items-center mx-auto"
      style={{ width: "1000px" }}
    >
      {/* Center the card within the screen */}
      <Card className="w-full max-w-xl text-center">
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(searchLocation);
            }}
            className="flex items-center gap-2"
          >
            <Input
              type="text"
              placeholder="Enter a city name"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              onSubmit={
                (e: ChangeEvent<HTMLInputElement>) =>
                  setSearchLocation(e.target.value) // Update location state on input change
              }
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Search"}{" "}
            </Button>
          </form>
          {/* Display error message if any */}
          {error && <div className="mt-4 text-red-500">{error}</div>}
          {/* Display weather data if available */}
          {weather && (
            <div className="mt-4 grid gap-2 h-1/2 mx-auto">
              {/* Display temperature message with icon */}
              <div className="flex items-center gap-2">
                <Shirt className=" h-6" />
                {getTemperatureMessage(weather.feelsLike, weather.unit)}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center w-1/2 gap-2">
                  <ThermometerIcon className=" h-6" />
                  {`Actual temperature is ${weather.temperature}`}
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className=" h-6 " />
                  <div>{getLocationMessage(weather.locationLight)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center w-1/2  gap-2">
                  <CloudIcon className=" h-6 " />
                  <div>{getWeatherMessage(weather.description)}</div>
                </div>
                <div className="flex items-center w-1/2 gap-2">
                  <Droplet className=" h-6 " />
                  <div>{`${weather.humidity}% humidity`}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center w-1/2 gap-2">
                  <Wind className=" h-6 " />
                  <div>{`${weather.windSpeed}km/hr wind`}</div>
                </div>
                <div className="flex items-center w-1/2 gap-2">
                  <Compass className=" h-6 " />
                  <div>{`${weather.windDirection} direction`}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
