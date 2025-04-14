"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { LngLatLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Mapbox.module.css";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/reducer/locationReducer"; // ensure this path matches your store file
import { setExactLocation } from "@/reducer/locationReducer";
import { fetchLocationName } from "@/lib/api";

const Mapbox: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const exactLocationReducer = useSelector(
    (state: RootState) => state.exactLocation
  );

  const dispatch = useDispatch();

  // Initial loading of the map componenet
  useEffect(() => {
    if (!exactLocationReducer.longitude || !exactLocationReducer.latitude) {
      return;
    }
    const center: LngLatLike = [
      exactLocationReducer.longitude,
      exactLocationReducer.latitude,
    ];

    if (mapContainerRef.current) {
      // Create the mapbox with defined parameters
      mapRef.current = new mapboxgl.Map({
        accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
        container: mapContainerRef.current,
        center: center, // starting position [lng, lat]
        zoom: 9, // starting zoom
      });

      // Define the behaviour of the mapbox
      mapRef.current.on("dragend", () => {
        // get the current center coordinates and zoom level from the map
        if (!mapRef.current) {
          return;
        }

        // Every time the user moves the map, update the reducer state of the map
        const mapCenter = mapRef.current.getCenter();
        fetchLocationName(mapCenter.lat, mapCenter.lng).then((locationData) =>
          dispatch(
            setExactLocation({
              latitude: mapCenter.lat,
              longitude: mapCenter.lng,
              placename: locationData.placename,
            })
          )
        );
      });
    }

    // Clean up on unmount
    return () => {
      mapRef.current?.remove();
    };
  }, []);

  // Everytime there is an location update, move the map
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
  }, [exactLocationReducer.latitude, exactLocationReducer.longitude]);

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
