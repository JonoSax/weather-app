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
          <div style={{ width: "50vw", height: "50vh", margin: "0 auto" }}>
            <Mapbox />
          </div>
        </div>
      </Provider>
    </div>
  );
}
