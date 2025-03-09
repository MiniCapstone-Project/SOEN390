import React, { useState, useRef, useEffect } from "react";
import { View, Keyboard, Alert, Text } from "react-native";
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
  // Check if Google Maps API key is available
  useEffect(() => {
    if (!googleMapsKey) {
      console.error("Google Maps API key is missing!");
      Alert.alert("Configuration Error", "Google Maps API key is missing. Some features may not work correctly.");
    } else {
      console.log("Google Maps API key is available:", googleMapsKey.substring(0, 5) + "...");
    }
  }, [googleMapsKey]);

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
      // Show loading state
      console.log("Searching for places...");
      
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

      // Set the results
      setResults(geojson as any);
      
      if (geojson.features.length) {
        const coords = geojson.features.map((feature: any) => ({
          latitude: feature.geometry.coordinates[1],
          longitude: feature.geometry.coordinates[0],
        }));
        
        // Fit the map to show all results
        mapRef.current?.fitToCoordinates(coords, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
        
        // Dismiss keyboard
        Keyboard.dismiss();
        
        console.log(`Found ${geojson.features.length} places`);
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
    
    // Animate to the location
    mapRef.current?.animateToRegion(
      {
        latitude: lat,
        longitude: lng,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      1000
    );
    
    // Create a GeoJSON feature from the selected place
    const selectedPlace = {
      type: "FeatureCollection",
      features: [{
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
        properties: {
          name: details.name,
          place_id: details.place_id,
          formatted_address: details.formatted_address || details.vicinity || "No address available",
          types: details.types || [],
          rating: (details as any).rating || 0,
          price_level: (details as any).price_level || 0,
          coordinate: {
            latitude: lat,
            longitude: lng,
          },
          // For compatibility with building data format
          Address: details.formatted_address || details.vicinity || "No address available",
          Building_Long_Name: details.name,
        }
      }]
    };
    
    // Show only this place as a result
    setResults(selectedPlace as any);
    
    // Dismiss keyboard
    Keyboard.dismiss();
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
        onFail={(error) => console.error("GooglePlacesAutocomplete failed:", error)}
        query={{
          key: googleMapsKey,
          language: "en",
          location: location ? `${location.latitude},${location.longitude}` : undefined,
          radius: 20000,
          types: 'establishment',
        }}
        textInputProps={{
          onChangeText: (text) => {
            setAutoSearchText(text);
            console.log("Text changed:", text); // Debug
          },
          onSubmitEditing: handleFullTextSearch,
          autoCapitalize: "none",
          autoCorrect: false,
        }}
        enablePoweredByContainer={false}
        minLength={2}
        debounce={200}
        nearbyPlacesAPI="GooglePlacesSearch"
        GooglePlacesSearchQuery={{
          rankby: 'distance'
        }}
        GooglePlacesDetailsQuery={{
          fields: 'geometry,formatted_address,name,place_id,types,rating,price_level',
        }}
        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
        renderRow={(data) => {
          console.log("Rendering suggestion:", data.description); // Debug
          return (
            <View style={{ padding: 10 }}>
              <Text style={{ fontSize: 15 }}>{data.description}</Text>
            </View>
          );
        }}
        styles={{
          container: { 
            flex: 0,
            width: '100%',
            zIndex: 9999
          },
          textInput: {
            ...DefaultMapStyle.searchBox,
            height: 44,
          },
          listView: { 
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#ddd',
            position: 'absolute',
            top: 44,
            left: 0,
            right: 0,
            zIndex: 9999,
            elevation: 5,
          },
          row: { 
            padding: 13, 
            height: 'auto', 
            backgroundColor: 'white'
          },
          separator: { height: 1, backgroundColor: '#c8c7cc' },
          description: { fontSize: 15 },
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
        }}
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