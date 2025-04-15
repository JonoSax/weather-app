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
  location: string;
  unit: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  time: number;
}

interface ExactLocation {
  latitude: number | null;
  longitude: number | null;
  placename: string | null;
}
