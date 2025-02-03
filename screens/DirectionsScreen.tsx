/**
 * This screen will be responsible for handling directions from one place to another
 */
import React, { useState, useRef } from "react";
import { View, StyleSheet, Keyboard, Dimensions, Text } from "react-native";
import MapView, {
  LatLng,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import {
  InputField,
  SearchBar,
} from "@/components/InputComponents/InputFields";
import { DefaultMapStyle } from "@/Styles/MapStyles";
import CustomButton from "../components/InputComponents/Buttons";
import MarkerInfoBox from "../components/MapComponents/MarkerInfoBox";
import { searchPlaces } from "../services/PlacesService";
import buildings from "@/Cartography/BuildingCampusMarkers";
import { useRequestLocationPermission } from "@/hooks/RequestUserLocation";

const googleMapsKey: string = process.env.GOOGLE_MAPS_API_KEY!; // Asserts that it's always defined

export default function DirectionsScreen() {
  const mapRef = useRef<MapView | null>(null);
  const currentCampus = {
    ...useRequestLocationPermission(),
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={DefaultMapStyle.container}>

      {currentCampus ? (
        <MapComponent mapRef={mapRef} currentCampus={currentCampus} />
      ) : (
        <Text>Fetching location...</Text>
      )}

      <SearchLocationWrapper />
    </View>
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

// This functon will return the coordiantes of the location from and to, and will be used
// To render the markers on the map, and to calculate the route between the two locations
const SearchLocationWrapper = () => {

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleFromChange = (text: string) => {
    setFrom(text);
  };

  const handleToChange = (text: string) => {
    setTo(text);
  };

  const handleSearch = () => {
    console.log("Searching from:", from, "to:", to);
    // autoCompleteResults = searchPlaces(from, to, googleMapsKey);
  };

  const handleClearFrom = () => {
    setFrom("");
  };

  const handleClearTo = () => {
    setTo("");
  };

  return (
    <View style={DefaultMapStyle.controlsContainer}>
      {/* "From" Input */}
      <InputField
        searchText={from}
        onSearchTextChange={handleFromChange}
        onSearchPress={handleSearch}
        onClearPress={handleClearFrom}
        style={DefaultMapStyle.inputField}
      />

      {/* "To" Input */}
      <InputField
        searchText={to}
        onSearchTextChange={handleToChange}
        onSearchPress={handleSearch}
        onClearPress={handleClearTo}
        style={stylDefaultMapStylees.inputField}
      />
    </View>
  );
};
