// Convert free text locations into co-ordinates
interface LocationData extends ExactLocation {
  time: number | null;
  error: string | null;
}

// Define a TypeScript interface for weather data
interface WeatherData {
  temperature: number;
  feelsLike: number;
  description: string;
  location: ExactLocation;
  unit: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  locationLight: LocationLight;
  time: number;
}

interface ExactLocation {
  latitude: number | null;
  longitude: number | null;
  placename: string | null;
}

interface LocationLight {
  sunrise: number;
  sunset: number;
}
