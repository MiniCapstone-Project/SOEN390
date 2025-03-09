import React, { useState, useRef } from "react";
import { View, Keyboard, Alert } from "react-native";
import MapView, { Region } from "react-native-maps";
import { DefaultMapStyle } from "@/Styles/MapStyles";
import { searchPlaces } from "@/services/PlacesService";
import { Button } from "react-native-paper";
import { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { ButtonsStyles } from "@/Styles/ButtonStyles";
import { LATITUDE_DELTA, LONGITUDE_DELTA } from "@/constants/MapsConstants";
// The single search UI, combining autocomplete + text-based search
export const AutocompleteSearchWrapper = ({
  mapRef,
  setResults,
  userLocation,
  currentCampus,
  googleMapsKey,
  location, // Accept location prop
}: {
  mapRef: React.RefObject<MapView>;
  setResults: React.Dispatch<React.SetStateAction<any[]>>;
  userLocation: Region | null;
  currentCampus: Region;
  googleMapsKey: string;
  location: Region | null; // Define location prop type
}) => {
  // This local state tracks typed text in the Autocomplete's field
  const [autoSearchText, setAutoSearchText] = useState("");

  // Perform a full text-based search, returning multiple results
  const handleFullTextSearch = async () => {
    if (!autoSearchText.trim()) return;

    const boundaries = await mapRef.current?.getMapBoundaries();
    console.log(boundaries);

    // Extract the two corners
    if (!boundaries) return;
    const { northEast, southWest } = boundaries;

    // Inline Haversine calculation (in meters)
    const R = 6378137; // Earth's approximate radius in meters
    const toRad = (val: number): number => (val * Math.PI) / 180;

    const dLat = toRad(southWest.latitude - northEast.latitude);
    const dLon = toRad(southWest.longitude - northEast.longitude);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(northEast.latitude)) *
        Math.cos(toRad(southWest.latitude)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceMeters = Math.round(R * c / 2);

    console.log('Distance between NE and SW corners (meters):', distanceMeters);

    try {
      const geojson = await searchPlaces(
        autoSearchText,
        userLocation?.latitude || currentCampus.latitude,
        userLocation?.longitude || currentCampus.longitude,
        googleMapsKey,
        distanceMeters
      );

      if (geojson.features.length === 0) {
        Alert.alert("No Results", "No locations found. Try a different search.", [{ text: "OK" }]);
        return;
      }

      setResults(geojson);
      if (geojson.features.length) {
        const coords = geojson.features.map((feature: any) => ({
          latitude: feature.geometry.coordinates[1],
          longitude: feature.geometry.coordinates[0],
        }));
        mapRef.current?.fitToCoordinates(coords, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
        Keyboard.dismiss();
      }
    } catch (error) {
      console.error("Error during text search:", error);
      Alert.alert("Error", "Failed to fetch places. Please try again.");
    }
  };

  // Handle user picking a suggestion from the dropdown
  const handleSelectSuggestion = (data: GooglePlaceData, details: GooglePlaceDetail | null) => {
    console.log("Selected place:", data, details);
    if (!details) return;

    const { lat, lng } = details.geometry.location;
    mapRef.current?.animateToRegion(
      {
        latitude: lat,
        longitude: lng,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      1000
    );
    // Show only this place as a result
    setResults([details]);
  };

  // Clear typed text and results
  const handleClearAll = () => {
    setAutoSearchText("");
    setResults([]);
    // Force the GooglePlacesAutocomplete component to clear
    if (googlePlacesRef.current) {
      googlePlacesRef.current.clear();
    }
  };

  // Create a ref for the GooglePlacesAutocomplete component
  const googlePlacesRef = useRef<any>(null);

  return (
    <View style={ButtonsStyles.searchWrapper}>
      {/* The Google Places Autocomplete field */}
      <GooglePlacesAutocomplete
        ref={googlePlacesRef}
        placeholder="Search for places, coffee shops, restaurants..."
        fetchDetails={true}
        onPress={handleSelectSuggestion}
        query={{
          key: googleMapsKey,
          language: "en",
          location: location ? `${location.latitude},${location.longitude}` : undefined, // Use location for suggestions
          radius: 20000, // 20 km radius
          types: 'restaurant,cafe,bar,food,store,shop', // Add types for POIs
        }}
        textInputProps={{
          value: autoSearchText,
          onChangeText: setAutoSearchText,
          onSubmitEditing: handleFullTextSearch, // Press Enter to do a multi-result search
        }}
        styles={{ container: { flex: 0 }, textInput: DefaultMapStyle.searchBox }}
      />

      {/* Buttons below the Autocomplete input */}
      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <Button
          mode="contained"
          onPress={handleFullTextSearch}
          style={{ marginRight: 5, flex: 1 }}
        >
          Search
        </Button>
        <Button mode="contained" onPress={handleClearAll} style={{ backgroundColor: "red", flex: 1 }}>
          Clear
        </Button>
      </View>
    </View>
  );
};