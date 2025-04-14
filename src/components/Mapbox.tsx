"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { LngLatLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Mapbox.module.css";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/reducer/locationReducer"; // ensure this path matches your store file
import { setExactLocation } from "@/reducer/locationReducer";

const Mapbox: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const exactLocationReducer = useSelector(
    (state: RootState) => state.exactLocation
  );

  // Initial loading of the map componenet
  useEffect(() => {
    // TO MAKE THE MAP APPEAR YOU MUST
    // ADD YOUR ACCESS TOKEN FROM
    // https://account.mapbox.com
    if (!exactLocationReducer.longitude || !exactLocationReducer.latitude) {
      return;
    }
    const center: LngLatLike = [
      exactLocationReducer.longitude,
      exactLocationReducer.latitude,
    ];

    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
        container: mapContainerRef.current,
        center: center, // starting position [lng, lat]
        zoom: 9, // starting zoom
      });
    }

    // Clean up on unmount
    return () => {
      mapRef.current?.remove();
    };
  }, []);

  // Evertime there is an location update, move the map
  useEffect(() => {
    if (
      !exactLocationReducer.longitude ||
      !exactLocationReducer.latitude ||
      !mapRef.current
    ) {
      return;
    }
    const center: LngLatLike = [
      exactLocationReducer.longitude,
      exactLocationReducer.latitude,
    ];
    mapRef.current.flyTo({
      center: center,
    });
  }, [exactLocationReducer]);

  return (
    <div
      id="map-container"
      style={{ height: "100%" }}
      ref={mapContainerRef}
      className="map-container"
    />
  );
};

export default Mapbox;
