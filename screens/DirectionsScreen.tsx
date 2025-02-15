import React, { useState, useRef, useEffect } from "react";
import { Button, View, Text, Dimensions } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Region, LatLng } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import CustomButton from "../components/InputComponents/Buttons";
import { DirectionsScreenStyles } from "@/Styles/MapStyles";
import { GOOGLE_MAPS_API_KEY } from "@/constants/GoogleKey";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SGW_CAMPUS } from "./MapExplorerScreen";
import "react-native-get-random-values";
import { useRoute } from "@react-navigation/native";
import { retrieveRoutes } from "@/services/DirectionService.ts";

const googleMapsKey = GOOGLE_MAPS_API_KEY;
const EDGE_PADDING = { top: 70, right: 70, bottom: 70, left: 70 };

export default function DirectionsScreen() {
  const mapRef = useRef<MapView | null>(null);
  const [origin, setOrigin] = useState<LatLng | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [showDirections, setShowDirections] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const route = useRoute();
  const destinationObject = route.params?.destination; // pass destination to second screen
  const [directionsRoute, setDirectionsRoute] = useState<LatLng | null>(null);  // create directions route state
  const [transportMode, setTransportMode] = useState<"DRIVING"|"WALKING"|"TRANSIT">("DRIVING");

  useEffect(() => {
    const loadSavedLocations = async () => {
      const savedOrigin = await AsyncStorage.getItem("origin");
      const savedDestination = await AsyncStorage.getItem("destination");
      if (savedOrigin) setOrigin(JSON.parse(savedOrigin));
      if (savedDestination) setDestination(JSON.parse(savedDestination));
    };
    loadSavedLocations();
  }, []);

  useEffect(() => {
      if (destinationObject) {  // if a destination object was passed
        console.log("Received " + destinationObject.Address);

      const initialDestinationSelect = async (setLocation: (loc: LatLng) => void, storageKey: string, destinationObject: any) => {
        const position: LatLng = {
          latitude: destinationObject.Latitude,
          longitude: destinationObject.Longitude,
        };

        console.log("Selected Location:", position); // Debugging

        setLocation(position);
        await AsyncStorage.setItem(storageKey, JSON.stringify(position));

        moveTo(position, 1);
      };
    initialDestinationSelect(setDestination, "destination", destinationObject);
    }
  }, [destinationObject]);

  useEffect(() => {
    if (origin && destination) {
      mapRef.current?.fitToCoordinates([origin, destination], {
        edgePadding: EDGE_PADDING,
        animated: true,
      });
    }
  }, [origin, destination]);

  const moveTo = (position: LatLng, zoomLevel: number) => {
    mapRef.current?.animateToRegion(
      {
        latitude: position.latitude,
        longitude: position.longitude,
        latitudeDelta: zoomLevel,
        longitudeDelta: zoomLevel,
      },
      1000
    );
  };

  const handleLocationSelect = async (details: any, setLocation: (loc: LatLng) => void, storageKey: string, destinationObject: any) => {
    const position: LatLng = {
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
    };

    console.log("Selected Location:", position); // Debugging

    setLocation(position);
    await AsyncStorage.setItem(storageKey, JSON.stringify(position));

    const zoomLevel = details.types.includes("country") ? 5 : 0.02;

    moveTo(position, zoomLevel);
  };
  
  const traceRoute = async () => {
      console.log("Origin: ", origin);
      console.log("Destination ", destination);
      console.log("Attempting to route"); // show debugging
    if (origin && destination) {
        try {
            const directions = await retrieveRoutes(origin.latitude, origin.longitude, destination.latitude, destination.longitude, transportMode, googleMapsKey);
            setDirectionsRoute(directions);
        } catch (error) {
            console.error("Error fetching directions ", error);
        }
    }
  };

  useEffect (() => {
    traceRoute();
  }, [transportMode]);

  const setWalking = () => {
      setTransportMode("WALKING");
  };

  const setDriving = () => {
      setTransportMode("DRIVING");
  };

  const setTransit = () => {
       setTransportMode("TRANSIT");
  };

  useEffect(() => {
      if (destination) {
          // automatic refresh to counteract rendering bugs by deleting this and saving
          // and then pasting it back in
          console.log("Refreshed app");
      }
  }, [destination]);

  useEffect(() => {
    if (directionsRoute) {
        //console.log("Route distance and duration:", distance, "m", duration, "min");
        console.log("Beginning Direction Rendering");  // proof that state changed and rendering should begin, if not it is an API or rendering issue
    }
  }, [directionsRoute]);

  return (
    <View style={DirectionsScreenStyles.container}>
      <MapView ref={mapRef} style={DirectionsScreenStyles.map} provider={PROVIDER_GOOGLE} initialRegion={SGW_CAMPUS}>
        {origin && <Marker coordinate={origin} />}
        {destination && <Marker coordinate={destination} />}
        {directionsRoute && origin && destination && (
          <MapViewDirections
            key={`${origin?.latitude}-${origin?.longitude}-${destination?.latitude}-${destination?.longitude}`}
            origin={origin}
            destination={destination}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeColor="#6644ff"
            strokeWidth={4}
            mode={transportMode}
            onReady={(args) => {
              setDistance(args.distance);
              setDuration(args.duration);
            }}
          />
        )}
      </MapView>

      <View style={DirectionsScreenStyles.searchContainer}>
        <GooglePlacesAutocomplete
          placeholder="Origin"
          fetchDetails
          onPress={(data, details) => details && handleLocationSelect(details, setOrigin, "origin")}
          query={{ key: GOOGLE_MAPS_API_KEY, language: "en" }}
          styles={{ container: { flex: 0, marginBottom: 10 }, textInput: DirectionsScreenStyles.input }}
        />
        <GooglePlacesAutocomplete
          placeholder={destinationObject?.Address || "Destination"}
          fetchDetails
          value = {destinationObject?.Address || ""}
          onPress={(data, details) => details && handleLocationSelect(details, setDestination, "destination")}
          query={{ key: GOOGLE_MAPS_API_KEY, language: "en" }}
          styles={{ container: { flex: 0, marginBottom: 10 }, textInput: DirectionsScreenStyles.input }}
        />
        <Button title="Route" color="#733038" onPress={traceRoute} />
        <Button title="Walking" color="#733038" marginBottom="20px" onPress={setWalking} />
        <Button title="Driving" color="#733038" marginBottom="20px" onPress={setDriving} />
        <Button title="Transit" color="#733038" marginBottom="20px" onPress={setTransit} />
        {distance > 0 && duration > 0 && (
          <View style={DirectionsScreenStyles.stats}>
            <Text>Distance: {distance.toFixed(2)} km</Text>
            <Text>Duration: {Math.ceil(duration)} min</Text>
          </View>
        )}
      </View>
    </View>
  );
}
