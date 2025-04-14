import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";

function getStoredState(): ExactLocation {
  const defaultLatitude = 51.04;
  const defaultLongitude = -114.07;
  const defaultPlacename = "Calgary, Ca";
  try {
    const stored = localStorage.getItem("weather_location");
    const { lat, lon, loc } = JSON.parse(stored!);
    const latitude = lat ? Number(lat) : defaultLatitude;
    const longitude = lon ? Number(lon) : defaultLongitude;
    const placename = loc ? String(loc) : defaultPlacename;
    return { latitude, longitude, placename };
  } catch {
    return {
      latitude: defaultLatitude,
      longitude: defaultLongitude,
      placename: defaultPlacename,
    };
  }
}
const initialState: ExactLocation = getStoredState();

export const exactLocationSlice = createSlice({
  name: "exactLocation",
  initialState,
  reducers: {
    setExactLocation: (state, action: PayloadAction<ExactLocation>) => {
      const lat = action.payload.latitude;
      const lon = action.payload.longitude;
      // round state to the nearest 2 decimal places
      state.latitude = lat && Math.round(lat * 100) / 100;
      state.longitude = lon && Math.round(lon * 100) / 100;
      state.placename = action.payload.placename;
      // store the state in localStorage
      localStorage.setItem(
        "weather_location",
        JSON.stringify({
          lat: state.latitude,
          lon: state.longitude,
          loc: state.placename,
        })
      );
    },
  },
});

const exactLocationSliceReducer = exactLocationSlice.reducer;

export const { setExactLocation } = exactLocationSlice.actions;
export default exactLocationSliceReducer;

export const store = configureStore({
  reducer: {
    exactLocation: exactLocationSliceReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
