import React from "react";
import { View, Text } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { IconButton } from "react-native-paper";
import { DirectionsScreenStyles } from "@/Styles/MapStyles";
import { findNextShuttle } from "@/services/ShuttleService";

const SearchContainer = ({
  googleMapsKey,
  handleLocationSelect,
  setOrigin,
  setDestination,
  destinationObject,
  traceRoute,
  setWalking,
  setDriving,
  setTransit,
  setShuttleRoute,
  showShuttleTime,
  setShowShuttleTime,
  distance,
  duration,
  shuttleValid,
}) => {
  return (
    <View style={DirectionsScreenStyles.searchContainer}>
      <GooglePlacesAutocomplete
        placeholder="Origin"
        fetchDetails
        onPress={(data, details) => details && handleLocationSelect(details, setOrigin, "origin", destinationObject)}
        query={{ key: googleMapsKey, language: "en" }}
        styles={{ container: { flex: 0, marginBottom: 10 }, textInput: DirectionsScreenStyles.input }}
      />
      <GooglePlacesAutocomplete
        placeholder={destinationObject?.Address || "Destination"}
        fetchDetails
        onPress={(data, details) => details && handleLocationSelect(details, setDestination, "destination", destinationObject)}
        query={{ key: googleMapsKey, language: "en" }}
        styles={{ container: { flex: 0, marginBottom: 10 }, textInput: DirectionsScreenStyles.input }}
      />
      <View style={DirectionsScreenStyles.buttonContainer}>
        <IconButton icon="directions" mode="contained" onPress={traceRoute} style={DirectionsScreenStyles.button} />
        <IconButton icon="walk" mode="contained" onPress={() => {setWalking(); setShowShuttleTime(false);}} style={DirectionsScreenStyles.button} />
        <IconButton icon="car" mode="contained" onPress={() => {setDriving(); setShowShuttleTime(false);}} style={DirectionsScreenStyles.button} />
        <IconButton icon="train" mode="contained" onPress={() => {setTransit(); setShowShuttleTime(false);}} style={DirectionsScreenStyles.button} />
        <IconButton icon="bus" mode="contained" onPress={() => {setShuttleRoute(); setShowShuttleTime(true);}} style={DirectionsScreenStyles.button} />
      </View>
      {distance > 0 && duration > 0 && (
        <View style={DirectionsScreenStyles.stats}>
          <Text>Distance: {distance.toFixed(2)} km</Text>
          <Text>Duration: {Math.ceil(duration)} min</Text>
          {showShuttleTime && <Text>{findNextShuttle(shuttleValid)}</Text>}
        </View>
      )}
    </View>
  );
};

export default SearchContainer;
