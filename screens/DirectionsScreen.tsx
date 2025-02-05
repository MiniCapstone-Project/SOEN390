/**
 * This screen will be responsible for handling directions from one place to another
 */
import React, { useState, useRef, useCallback } from "react";
import { View, Text } from "react-native";
import MapView, {
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import { debounce } from "lodash";
import { InputField } from "@/components/InputComponents/InputFields";
import { DefaultMapStyle } from "@/Styles/MapStyles";
import CustomButton from "../components/InputComponents/Buttons";
import MarkerInfoBox from "../components/MapComponents/MarkerInfoBox";
import { searchPlaces } from "../services/PlacesService";
import buildings from "@/Cartography/BuildingCampusMarkers";
import Config from "react-native-config";
import { useRequestLocationPermission } from "@/hooks/RequestUserLocation";


// Use Config to retrieve the API key
const googleMapsKey: string = Config.GOOGLE_MAPS_API_KEY!;

export default function DirectionsScreen() {
  const mapRef = useRef<MapView | null>(null);
  
  // Attempt to get the user's location using a custom hook
  const userLocation = useRequestLocationPermission();
  
  // get actual coordinates and switch to user location 
  const currentCampus: Region = {
    latitude: 45.497092,
    longitude: -73.5788,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  
  // If location isn't available yet, display a loading state.
  if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
    return (
      <View style={DefaultMapStyle.container}>
      <MapComponent mapRef={mapRef} currentCampus={currentCampus} />
      <SearchLocationWrapper />
    </View>
    );
  }

  // Build a valid region object for MapView.

  return (
<>
</>
  );
}

const MapComponent = ({
  mapRef,
  currentCampus,
}: {
  mapRef: React.RefObject<MapView>;
  currentCampus: Region;
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
    ></MapView>
  );
};


const SearchLocationWrapper = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // Debounced search function (prevents excessive API calls)
  const handleSearch = useCallback(
    debounce((updatedFrom: string, updatedTo: string) => {
      console.log("Searching from:", updatedFrom, "to:", updatedTo);
    }, 500), 
    []
  );

  const handleFromChange = (text: string) => {
    setFrom(text);
    handleSearch(text, to); 
  };

  const handleToChange = (text: string) => {
    setTo(text);
    handleSearch(from, text); 
  };

  const handleClearFrom = () => {
    setFrom("");
    handleSearch("", to); 
  };

  const handleClearTo = () => {
    setTo("");
    handleSearch(from, ""); 
  };

  return (
    <View style={DefaultMapStyle.controlsContainer}>
      {/* "From" Input */}
      <InputField
        placeholder="From"
        searchText={from}
        onSearchTextChange={handleFromChange}
        onSearchPress={() => handleSearch(from, to)}
        onClearPress={handleClearFrom}
      />

      {/* "To" Input */}
      <InputField
        placeholder="To"
        searchText={to}
        onSearchTextChange={handleToChange}
        onSearchPress={() => handleSearch(from, to)}
        onClearPress={handleClearTo}
      />
    </View>
  );
};

