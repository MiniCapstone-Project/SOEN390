import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Keyboard, Dimensions, Alert } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region, Geojson } from "react-native-maps";
import { DefaultMapStyle } from "@/Styles/MapStyles";
import CustomButton from "../components/InputComponents/Buttons";
import MarkerInfoBox from "../components/MapComponents/MarkerInfoBox";
import { searchPlaces } from "../services/PlacesService";
import { GOOGLE_MAPS_API_KEY } from "@/constants/GoogleKey";
import { useNavigation } from "@react-navigation/native";
import buildingMarkers from "@/gis/building-markers.json"; // Updated import path
import { Button } from "react-native-paper";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import { ButtonsStyles } from "@/Styles/ButtonStyles";

const googleMapsKey = GOOGLE_MAPS_API_KEY;

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// Define campus regions
export const SGW_CAMPUS: Region = {
  latitude: 45.497092,
  longitude: -73.5788,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

export const LOY_CAMPUS: Region = {
  latitude: 45.458705,
  longitude: -73.640523,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

// For displaying a set of markers
const MarkersComponent = ({
  data,
  handleMarkerPress,
}: {
  data: any[];
  handleMarkerPress: (marker: any) => void;
}) => {
  return data.map((item, index) => (
    <Marker
      key={`marker-${index}`}
      coordinate={{
        latitude: item.Latitude || item.geometry?.location?.lat,
        longitude: item.Longitude || item.geometry?.location?.lng,
      }}
      title={item.BuildingName || item.name}
      pinColor={item.BuildingName ? "#4A90E2" : "#FF5733"}
      onPress={() => handleMarkerPress(item)}
    />
  ));
};

// Wrapper for the <MapView> component
const MapComponent = ({
  mapRef,
  results,
  currentCampus,
  handleMarkerPress,
}: {
  mapRef: React.RefObject<MapView>;
  results: any[];
  currentCampus: Region;
  handleMarkerPress: (marker: any) => void;
}) => {
  return (
    <MapView
      ref={mapRef}
      style={DefaultMapStyle.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={currentCampus}
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
      <MarkersComponent data={[...results]} handleMarkerPress={handleMarkerPress} />
      <Geojson geojson={buildingMarkers} strokeColor="blue" fillColor="cyan" strokeWidth={2} />
    </MapView>
  );
};

// The single search UI, combining autocomplete + text-based search
const AutocompleteSearchWrapper = ({
  mapRef,
  setResults,
  userLocation,
  currentCampus,
  googleMapsKey,
}: {
  mapRef: React.RefObject<MapView>;
  setResults: React.Dispatch<React.SetStateAction<any[]>>;
  userLocation: Region | null;
  currentCampus: Region;
  googleMapsKey: string;
}) => {
  // This local state tracks typed text in the Autocomplete's field
  const [autoSearchText, setAutoSearchText] = useState("");

  // Perform a full text-based search, returning multiple results
  const handleFullTextSearch = async () => {
    if (!autoSearchText.trim()) return;

    try {
      const { results, coords } = await searchPlaces(
        autoSearchText,
        userLocation?.latitude || currentCampus.latitude,
        userLocation?.longitude || currentCampus.longitude,
        googleMapsKey
      );

      if (results.length === 0) {
        Alert.alert("No Results", "No locations found. Try a different search.", [{ text: "OK" }]);
        return;
      }

      setResults(results);
      if (coords.length) {
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
  const handleSelectSuggestion = (data: any, details: any | null) => {
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
  };

  return (
    <View style={ButtonsStyles.searchWrapper}>
      {/* The Google Places Autocomplete field */}
      <GooglePlacesAutocomplete
        placeholder="Search for places..."
        fetchDetails={true}
        onPress={handleSelectSuggestion}
        query={{
          key: googleMapsKey,
          language: "en",
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

export default function MapExplorerScreen() {
  const mapRef = useRef<MapView | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [currentCampus, setCurrentCampus] = useState<Region>(SGW_CAMPUS);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [showInfoBox, setShowInfoBox] = useState(false);
  const [userLocation, setUserLocation] = useState<Region | null>(null);
  const navi = useNavigation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
          maximumAge: 10000,
          timeout: 5000,
        });
        const { latitude, longitude } = location.coords;
        const userRegion: Region = {
          latitude,
          longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
        setUserLocation(userRegion);
        mapRef.current?.animateToRegion(userRegion, 1000);
      } catch (error) {
        console.error("Error getting location:", error);
      }
    })();
  }, []);

  const handleMarkerPress = (marker: any) => {
    if (selectedMarker === marker) {
      setShowInfoBox(true);
    } else {
      setSelectedMarker(marker);
      setShowInfoBox(false);
    }
  };

  const handleCloseInfoBox = () => {
    setShowInfoBox(false);
    setSelectedMarker(null);
  };

  const handleDirections = (marker: any) => {
    console.log("Selected marker ", selectedMarker);
    navi.navigate("Directions", { destination: selectedMarker });
  };

  const handleSwitchToSGW = () => {
    setCurrentCampus(SGW_CAMPUS);
    mapRef.current?.animateToRegion(SGW_CAMPUS, 1000);
  };

  const handleSwitchToLoyola = () => {
    setCurrentCampus(LOY_CAMPUS);
    mapRef.current?.animateToRegion(LOY_CAMPUS, 1000);
  };

  const handleCenterToUserLocation = () => {
    if (userLocation) {
      mapRef.current?.animateToRegion(userLocation, 1000);
    } else {
      Alert.alert("Location not available", "User location is not available yet.");
    }
  };

  return (
    <View style={DefaultMapStyle.container}>
      {/* Our map & markers */}
      <MapComponent
        mapRef={mapRef}
        results={results}
        currentCampus={userLocation || currentCampus}
        handleMarkerPress={handleMarkerPress}
      />

      <View style={ButtonsStyles.controlsContainer}>
        {/* Only the new GooglePlacesAutocomplete-based search */}
        <AutocompleteSearchWrapper
          mapRef={mapRef}
          setResults={setResults}
          userLocation={userLocation}
          currentCampus={currentCampus}
          googleMapsKey={googleMapsKey}
        />

        <View style={ButtonsStyles.buttonContainer}>
          <Button mode="contained" onPress={handleSwitchToSGW} style={ButtonsStyles.button}>
            SGW
          </Button>
          <Button mode="contained" onPress={handleSwitchToLoyola} style={ButtonsStyles.button}>
            Loyola
          </Button>
          <Button mode="contained" onPress={handleCenterToUserLocation} style={ButtonsStyles.button}>
            ME
          </Button>
        </View>
      </View>

      {showInfoBox && selectedMarker && (
        <MarkerInfoBox
          title={selectedMarker.BuildingName || selectedMarker.name}
          address={selectedMarker.Address || selectedMarker.vicinity}
          onClose={handleCloseInfoBox}
          onDirections={handleDirections}
        />
      )}
    </View>
  );
}