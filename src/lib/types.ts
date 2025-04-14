// Convert free text locations into co-ordinates
interface LocationData extends Location {
  fullLocationName: string | null;
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

interface Location {
  latitude: number | null;
  longitude: number | null;
}
