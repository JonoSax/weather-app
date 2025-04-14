// Convert free text locations into co-ordinates
interface LocationData {
  fullLocationName: string | null;
  latitude: number | null;
  longitude: number | null;
  time: number | null;
  error: string | null;
}

// Define a TypeScript interface for weather data
interface WeatherData {
  temperature: number;
  description: string;
  location: string;
  unit: string;
}
