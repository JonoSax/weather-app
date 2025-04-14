import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert free text locations into co-ordinates
export const fetchLocation = async (
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
          fullLocationName: null,
          latitude: null,
          longitude: null,
          time: null,
          error: String(error),
        }; // Return error message
      }

      const fullLocationName = `${locationData.name}, ${locationData.country}`;
      const latitude = locationData.lat; // Get latitude
      const longitude = locationData.lon; // Get longitude
      const time = Math.floor(Date.now() / 1000); // Get current time in seconds since epoch
      return { fullLocationName, latitude, longitude, time, error: null }; // Return latitude, longitude, and time
    } else {
      const message = await response.json();
      return {
        fullLocationName: null,
        latitude: null,
        longitude: null,
        time: null,
        error: message.error.message,
      }; // Return error message
    }
  } catch (error) {
    console.error("Error fetching location data:", error);
    return {
      fullLocationName: null,
      latitude: null,
      longitude: null,
      time: null,
      error: String(error),
    }; // Return error message
  }
};
