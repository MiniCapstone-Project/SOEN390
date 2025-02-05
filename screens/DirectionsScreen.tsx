/**
 * This screen is responsible for handling directions from one place to another.
 * It uses autocomplete inputs to let the user pick an origin and destination,
 * then shows the route on a Google map.
 */
import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Region,
  LatLng,
} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Config from "react-native-config"; 
import CustomButton from "../components/InputComponents/Buttons";
import { DefaultMapStyle } from "@/Styles/MapStyles";
import { useRequestLocationPermission } from "@/hooks/RequestUserLocation";
import { DirectionsScreenStyles } from "@/Styles/MapStyles";

// Get your Google Maps API key from config
const googleMapsKey: string = Config.GOOGLE_MAPS_API_KEY!;

// Define the edge padding for fitting markers
const EDGE_PADDING = { top: 70, right: 70, bottom: 70, left: 70 };
const { width, height } = Dimensions.get("window");

export default function DirectionsScreen() {
  const mapRef = useRef<MapView | null>(null);

  const userLocation = useRequestLocationPermission();

  const currentCampus: Region = {
    latitude: 45.497092,
    longitude: -73.5788,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const [origin, setOrigin] = useState<LatLng | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [showDirections, setShowDirections] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);

  // Move camera to a given position
  const moveTo = async (position: LatLng) => {
    const camera = await mapRef.current?.getCamera();
    if (camera) {
      camera.center = position;
      mapRef.current?.animateCamera(camera, { duration: 1000 });
    }
  };

  const traceRouteOnReady = (args: { distance: number; duration: number }) => {
    setDistance(args.distance);
    setDuration(args.duration);
  };

  const traceRoute = () => {
    if (origin && destination) {
      setShowDirections(true);
      mapRef.current?.fitToCoordinates([origin, destination], {
        edgePadding: EDGE_PADDING,
      });
    }
  };

  const LocationAutocomplete = ({
    placeholder,
    onPlaceSelected,
  }: {
    placeholder: string;
    onPlaceSelected: (details: any) => void;
  }) => {
    return (
      <GooglePlacesAutocomplete
        placeholder={placeholder}
        fetchDetails
        onPress={(data, details = null) => {
          if (details) {
            onPlaceSelected(details);
          }
        }}
        query={{
          key: googleMapsKey,
          language: "en",
        }}
        styles={{
          container: { flex: 0, marginBottom: 10 },
          textInput: DirectionsScreenStyles.input,
        }}
      />
    );
  };

  // If the user location isn’t available yet, show a loading state with the map centered on the campus
  const initialRegion = userLocation && userLocation.latitude && userLocation.longitude
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : currentCampus;

  return (
    <View style={DirectionsScreenStyles.container}>
      <MapView
        ref={mapRef}
        style={DirectionsScreenStyles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        customMapStyle={[
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "poi.business",
            stylers: [{ visibility: "off" }],
          },
        ]}
      >
        {origin && <Marker coordinate={origin} />}
        {destination && <Marker coordinate={destination} />}
        {showDirections && origin && destination && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={googleMapsKey}
            strokeColor="#6644ff"
            strokeWidth={4}
            onReady={traceRouteOnReady}
          />
        )}
      </MapView>

      {/* The search container is overlayed on top of the map */}
      <View style={DirectionsScreenStyles.searchContainer}>
        <LocationAutocomplete
          placeholder="Origin"
          onPlaceSelected={(details) => {
            const position: LatLng = {
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            };
            setOrigin(position);
            moveTo(position);
          }}
        />
        <LocationAutocomplete
          placeholder="Destination"
          onPlaceSelected={(details) => {
            const position: LatLng = {
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            };
            setDestination(position);
            moveTo(position);
          }}
        />
        <CustomButton title="Route" onPress={traceRoute} />
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
