import React, { useState, useRef, useEffect } from "react";
import { View, Alert, TouchableOpacity, Text } from "react-native";
import MapView, {
  PROVIDER_GOOGLE,
  Region,
  Geojson,
  Circle,
  Marker,
} from "react-native-maps";
import { DefaultMapStyle } from "@/Styles/MapStyles";
import { CustomMarkersComponent } from "../components/MapComponents/MarkersComponent";
import { GOOGLE_MAPS_API_KEY } from "@/constants/GoogleKey";
import { useNavigation } from "@react-navigation/native";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import { Button } from "react-native-paper";
import * as Location from "expo-location";
import { ButtonsStyles } from "@/Styles/ButtonStyles";
import {
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
  LOY_CAMPUS,
  SGW_CAMPUS,
} from "@/constants/MapsConstants";
import { AutocompleteSearchWrapper } from "@/components/InputComponents/AutoCompleteSearchWrapper";
import MarkerInfoBox from "@/components/MapComponents/MarkerInfoBox";
import { MapExplorerScreenStyles } from "@/Styles/MapExplorerScreenStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { fetchPlaceDetails } from "@/services/PlacesService";
import { POIDetails } from "@/types/MapTypes";
import { MarkerItem } from "@/types/MapComponentTypes";

const googleMapsKey = GOOGLE_MAPS_API_KEY;

const buildingMarkers =
  require("@/gis/building-markers.json") as FeatureCollection<
    Geometry,
    GeoJsonProperties
  >;
const buildingOutlines =
  require("@/gis/building-outlines.json") as FeatureCollection<
    Geometry,
    GeoJsonProperties
  >;
const hall9RoomsPois =
  require("@/gis/hall-9-rooms-pois.json") as FeatureCollection<
    Geometry,
    GeoJsonProperties
  >;
const hall9FloorPlan =
  require("@/gis/hall-9-floor-plan.json") as FeatureCollection<
    Geometry,
    GeoJsonProperties
  >;

const markerImage = require("@/assets/images/marker.png");

export default function MapExplorerScreen() {
  const mapRef = useRef<MapView | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [currentCampus, setCurrentCampus] = useState<Region>(SGW_CAMPUS);
  const [showInfoBox, setShowInfoBox] = useState(false);
  const [userLocation, setUserLocation] = useState<Region | null>(null);

  const [selectedCoordinate, setSelectedCoordinate] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [mapRegion, setMapRegion] = useState<Region>(SGW_CAMPUS);
  const navi = useNavigation();

  const [selectedProperties, setSelectedProperties] = useState<any>(null);

  const [buildingMarkerItems, setBuildingMarkerItems] = useState<MarkerItem[]>([]);

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

  useEffect(() => {
    // This will log the building markers for debugging
    const markers = convertGeoJsonToMarkers();
    console.log(`Generated ${markers.length} building markers`);
    if (markers.length > 0) {
      console.log('First marker sample:', markers[0]);
    }
    setBuildingMarkerItems(markers);
  }, [buildingMarkers]);

  const handleMarkerPress = (markerData: any) => {
    const coordinate = markerData.coordinate || {
      latitude: markerData.Latitude || markerData.geometry?.location?.lat,
      longitude: markerData.Longitude || markerData.geometry?.location?.lng,
    };

    if (!coordinate.latitude || !coordinate.longitude) {
      console.error("Invalid coordinates in marker data:", markerData);
      return;
    }

    setSelectedCoordinate(coordinate);
    setSelectedProperties(markerData);
    setShowInfoBox(true);
  };

  const handleCloseInfoBox = () => {
    setShowInfoBox(false);
    setSelectedCoordinate(null);
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
      Alert.alert(
        "Location not available",
        "User location is not available yet."
      );
    }
  };

  const handleGoPress = () => {
    console.log("GO button pressed");
  };

  const handleRegionChange = (region: Region) => {
    setMapRegion(region);
  };

  const handleOutlinePress = (event: any) => {
    console.log("Building outline pressed:", event);
  };

  useEffect(() => {
    if (results && results.length > 0) {
      console.log(
        "Search results updated:",
        results.map((r) => ({
          name: r.name,
          coordinate: r.coordinate,
          hasCoords: !!r.coordinate || !!r.geometry?.location,
        }))
      );
    }
  }, [results]);

  const convertGeoJsonToMarkers = (): MarkerItem[] => {
    if (!buildingMarkers || !buildingMarkers.features) {
      console.log("No building markers data available");
      return [];
    }
    
    const markers = [];
    
    for (const feature of buildingMarkers.features) {
      try {
        let lat = null, lng = null;
        
        // Extract coordinates based on geometry type
        if (feature.geometry.type === 'Point') {
          lng = feature.geometry.coordinates[0];
          lat = feature.geometry.coordinates[1];
        } else if (feature.geometry.type === 'Polygon') {
          lng = feature.geometry.coordinates[0][0][0];
          lat = feature.geometry.coordinates[0][0][1];
        }
        
        if (lat && lng) {
          const properties = feature.properties || {};
          markers.push({
            Latitude: lat,
            Longitude: lng,
            name: properties.BuildingName || properties.name || `Building ${markers.length}`,
            formatted_address: properties.Address || properties.address || "",
            ...properties
          });
        }
      } catch (e) {
        console.error("Error processing marker:", e);
      }
    }
    
    console.log(`Processed ${markers.length} building markers`);
    return markers;
  };

  return (
    <View style={DefaultMapStyle.container}>
      <MapView
        ref={mapRef}
        style={DefaultMapStyle.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={currentCampus}
        onRegionChangeComplete={handleRegionChange}
        showsBuildings={false}
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
        <CustomMarkersComponent
          data={results}
          handleMarkerPress={handleMarkerPress}
        />

        <CustomMarkersComponent
          data={buildingMarkerItems}
          handleMarkerPress={handleMarkerPress}
        />

        <Geojson
          geojson={buildingOutlines}
          strokeColor="green"
          fillColor="rgba(255, 0, 200, 0.16)"
          strokeWidth={2}
          onPress={handleOutlinePress}
          tappable={true}
        />

        <Geojson
          geojson={hall9RoomsPois}
          image={markerImage}
          strokeColor="red"
          fillColor="rgba(255, 0, 0, 0.5)"
          strokeWidth={2}
          tappable={true}
        />
        <Geojson
          geojson={hall9FloorPlan}
          strokeColor="orange"
          fillColor="rgba(255, 165, 0, 0.5)"
          strokeWidth={2}
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

      {showInfoBox && selectedCoordinate && (
        <MarkerInfoBox
          coordinate={selectedCoordinate}
          title={selectedProperties?.name || selectedProperties?.BuildingName || "Selected Location"}
          properties={selectedProperties}
          onClose={handleCloseInfoBox}
        />
      )}

      <View
        style={[
          ButtonsStyles.controlsContainer,
          MapExplorerScreenStyles.controlsContainer,
        ]}
      >
        <AutocompleteSearchWrapper
          mapRef={mapRef}
          setResults={setResults}
          userLocation={userLocation}
          currentCampus={currentCampus}
          googleMapsKey={googleMapsKey}
          location={userLocation}
        />
      </View>
      <View
        style={[
          ButtonsStyles.buttonContainer,
          MapExplorerScreenStyles.buttonContainer,
        ]}
      >
        <Button
          mode="contained"
          onPress={handleSwitchToSGW}
          style={ButtonsStyles.button}
        >
          SGW
        </Button>
        <Button
          mode="contained"
          onPress={handleSwitchToLoyola}
          style={ButtonsStyles.button}
        >
          Loyola
        </Button>
        <Button
          mode="contained"
          onPress={handleCenterToUserLocation}
          style={ButtonsStyles.button}
        >
          ME
        </Button>
        <Button
          mode="contained"
          onPress={handleGoPress}
          style={ButtonsStyles.button}
        >
          GO
        </Button>
      </View>
    </View>
  );
}
