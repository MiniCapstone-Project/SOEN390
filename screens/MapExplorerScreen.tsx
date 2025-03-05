import React, { useState, useRef, useEffect } from "react";
import { View, Alert } from "react-native";
import MapView, { PROVIDER_GOOGLE, Region, Geojson, Circle } from "react-native-maps";
import { DefaultMapStyle } from "@/Styles/MapStyles";
import {CustomMarkersComponent} from "../components/MapComponents/MarkersComponent";
import { GOOGLE_MAPS_API_KEY } from "@/constants/GoogleKey";
import { useNavigation } from "@react-navigation/native";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import { Button } from "react-native-paper";
import * as Location from "expo-location";
import { ButtonsStyles } from "@/Styles/ButtonStyles";
import { LATITUDE_DELTA, LONGITUDE_DELTA, LOY_CAMPUS, SGW_CAMPUS } from "@/constants/MapsConstants";
import { AutocompleteSearchWrapper } from "@/components/InputComponents/AutoCompleteSearchWrapper";
import MarkerInfoBox from "@/components/MapComponents/MarkerInfoBox";
import { MapExplorerScreenStyles } from "@/Styles/MapExplorerScreenStyles";

const googleMapsKey = GOOGLE_MAPS_API_KEY;

const buildingMarkers = require("@/gis/building-markers.json") as FeatureCollection<Geometry, GeoJsonProperties>;
const buildingOutlines = require("@/gis/building-outlines.json") as FeatureCollection<Geometry, GeoJsonProperties>;

// Wrapper for the <MapView> component
const MapComponent = ({
  mapRef,
  results,
  currentCampus,
  handleMarkerPress,
  userLocation,
}: {
  mapRef: React.RefObject<MapView>;
  results: any[];
  currentCampus: Region;
  handleMarkerPress: (marker: any) => void;
  userLocation: Region | null;
}) => {
  const handleOutlinePress = (event: any) => {
    console.log("Building outline pressed:", event);
  };

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
      <CustomMarkersComponent data={[...results]} handleMarkerPress={handleMarkerPress} />
      <Geojson geojson={buildingMarkers} strokeColor="blue" fillColor="cyan" strokeWidth={2} tappable={true} />
      <Geojson
        geojson={buildingOutlines}
        strokeColor="green"
        fillColor="rgba(0, 255, 0, 0.1)"
        strokeWidth={2}
        onPress={handleOutlinePress}
        tappable={true}
      />
      {userLocation && (
        <>
          <Circle
            center={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            radius={10}
            strokeColor="rgba(0, 122, 255, 0.3)"
            fillColor="rgb(0, 123, 255)"
          />
          <Circle
            center={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            radius={50}
            strokeColor="rgba(0, 122, 255, 0.3)"
            fillColor="rgba(0, 122, 255, 0.1)"
          />
        </>
      )}
    </MapView>
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

  const handleGoPress = () => {
    console.log("GO button pressed");
  };

  return (
    <View style={DefaultMapStyle.container}>
      {/* Our map & markers */}
      <MapComponent
        mapRef={mapRef}
        results={results}
        currentCampus={userLocation || currentCampus}
        handleMarkerPress={handleMarkerPress}
        userLocation={userLocation}
      />
      <View style={[ButtonsStyles.controlsContainer, MapExplorerScreenStyles.controlsContainer]}>
        {/* Only the new GooglePlacesAutocomplete-based search */}
        <AutocompleteSearchWrapper
          mapRef={mapRef}
          setResults={setResults}
          userLocation={userLocation}
          currentCampus={currentCampus}
          googleMapsKey={googleMapsKey}
          location={userLocation} // Pass userLocation to AutocompleteSearchWrapper
        />
      </View>
      <View style={[ButtonsStyles.buttonContainer, MapExplorerScreenStyles.buttonContainer]}>
        <Button mode="contained" onPress={handleSwitchToSGW} style={ButtonsStyles.button}>
          SGW
        </Button>
        <Button mode="contained" onPress={handleSwitchToLoyola} style={ButtonsStyles.button}>
          Loyola
        </Button>
        <Button mode="contained" onPress={handleCenterToUserLocation} style={ButtonsStyles.button}>
          ME
        </Button>
        <Button mode="contained" onPress={handleGoPress} style={ButtonsStyles.button}>
          GO
        </Button>
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