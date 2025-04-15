"use client";
import Mapbox from "@/components/Mapbox";
import WeatherWidget from "@/components/WeatherWidget";
import { Provider } from "react-redux";
import { store } from "@/reducer/locationReducer";

export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Provider store={store}>
        <div>
          <WeatherWidget />
          <Mapbox />
        </div>
      </Provider>
    </div>
  );
}
