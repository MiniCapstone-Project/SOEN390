import React, { useState, useRef, useEffect } from "react";

import { View, Alert, ScrollView, Dimensions } from "react-native";
import MapView, { PROVIDER_GOOGLE, Region, Geojson, Circle, Marker } from "react-native-maps";

import { DefaultMapStyle } from "@/Styles/MapStyles";
import { CustomMarkersComponent } from "../components/MapComponents/MarkersComponent";
import { GOOGLE_MAPS_API_KEY } from "@/constants/GoogleKey";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import { Button, List } from "react-native-paper";
import * as Location from "expo-location";
import { ButtonsStyles } from "@/Styles/ButtonStyles";
import {
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
  LOY_CAMPUS,
  SGW_CAMPUS,
} from "@/constants/MapsConstants";
import { AutocompleteSearchWrapper } from "@/components/InputComponents/AutoCompleteSearchWrapper";
import { MarkerInfoBox } from "@/components/MapComponents/MarkerInfoBox";
import { CommonActions } from '@react-navigation/native';

import { MapExplorerScreenStyles } from "@/Styles/MapExplorerScreenStyles";

const googleMapsKey = GOOGLE_MAPS_API_KEY;


const buildingMarkers = require("@/gis/building-markers.json") as FeatureCollection<Geometry, GeoJsonProperties>;
const buildingOutlines = require("@/gis/building-outlines.json") as FeatureCollection<Geometry, GeoJsonProperties>;
const hall9RoomsPois = require("@/gis/hall-9-rooms-pois.json") as FeatureCollection<Geometry, GeoJsonProperties>;
const hall9FloorPlan = require("@/gis/hall-9-floor-plan.json") as FeatureCollection<Geometry, GeoJsonProperties>;
const hall8RoomsPois = require("@/gis/hall-8-rooms-pois.json") as FeatureCollection<Geometry, GeoJsonProperties>;
const hall8FloorPlan = require("@/gis/hall-8-floor-plan.json") as FeatureCollection<Geometry, GeoJsonProperties>;



const markerImage = require("@/assets/images/marker.png");

const handleRoomPoiPress = (event: any) => {
  console.log("Hall 9 room POI pressed:", event);
};

const ZOOM_LEVEL_THRESHOLD = 19;
const BUILDING_MARKERS_ZOOM_THRESHOLD = 18;

// Wrapper for the <MapView> component
const MapComponent = ({
  mapRef,
  results,
  currentCampus,
  userLocation,
  setSelectedMarker,
  visibleLayers,
}: {
  mapRef: React.RefObject<MapView>;
  results: any;
  currentCampus: Region;
  userLocation: Region | null;
  setSelectedMarker: React.Dispatch<React.SetStateAction<any>>;
  visibleLayers: { [key: string]: boolean };
}) => {
  const handleOutlinePress = (event: any) => {
    console.log("Outline pressed", event);
    // Additional handling for outline press events
  };


  const handleSearchResultPress = (event: any) => {
    console.log("Search result pressed", event);
    if (event.feature.properties) {
      // Format the properties for display
      const properties = event.feature.properties;
      
      // Add any missing properties needed by the UI
      if (!properties.coordinate && event.feature.geometry) {
        properties.coordinate = {
          latitude: event.feature.geometry.coordinates[1],
          longitude: event.feature.geometry.coordinates[0]
        };
      }
      
      // Set extra information for POIs
      if (properties.types && properties.types.length > 0) {
        // Capitalize and format types for display
        properties.poi_type = properties.types
          .map((type: string) => type.replace(/_/g, ' '))
          .map((type: string) => type.charAt(0).toUpperCase() + type.slice(1))
          .join(', ');
      }
      
      // Set all required state variables to show the info box
      setSelectedMarker(properties);
      setSelectedCoordinate({
        latitude: properties.coordinate.latitude,
        longitude: properties.coordinate.longitude
      });
      setSelectedProperties(properties);
      setShowInfoBox(true);
    }
  };

  const [selectedCoordinate, setSelectedCoordinate] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedProperties, setSelectedProperties] = useState<any>(null);
  const [showInfoBox, setShowInfoBox] = useState(false);
  const navi = useNavigation();

  const handleMarkerPress = (markerData: any) => {
    console.log("Building marker pressed:", markerData);
    if (markerData.coordinates) {
      setSelectedCoordinate(markerData.coordinates);
      setSelectedProperties(markerData.feature?.properties
        ? { ...markerData.feature.properties, coordinate: markerData.coordinates }
        : markerData);
      setShowInfoBox(true);
      setSelectedMarker(markerData);
    } else {
      console.log("No coordinates found in marker data");
    }
  };

  const handleDirections = (selectedProperties: any) => {
    if (!userLocation) {
      Alert.alert("Location not available", "User location is not available yet.");
      return;
    }
    navi.dispatch(
      CommonActions.navigate({
        name: 'Directions',
        params: {
          origin: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
          destination: {
            Address: selectedProperties.Address || selectedProperties.Building_Long_Name || "Selected Location",
            Latitude: selectedProperties.coordinate.latitude,
            Longitude: selectedProperties.coordinate.longitude,
          },
        },
      })
    );
  };

  const [zoomLevel, setZoomLevel] = useState<number>(0);

  const handleRegionChangeComplete = (region: Region) => {
    const zoom = Math.log2(360 * (Dimensions.get('window').width / 256 / region.longitudeDelta)) + 1;
    setZoomLevel(zoom);
  };

  return (
    <>
      <MapView
        ref={mapRef}
        style={DefaultMapStyle.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={currentCampus}
        showsBuildings={false}
        customMapStyle={[
          { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
          { featureType: "poi.business", stylers: [{ visibility: "off" }] },
        ]}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {/* {zoomLevel > BUILDING_MARKERS_ZOOM_THRESHOLD && (
        )} */}
        
        <Geojson
          geojson={buildingMarkers}
          strokeColor="blue"
          fillColor="cyan"
          strokeWidth={2}
          tappable={true}
          onPress={handleMarkerPress}
        />
        <Geojson
          geojson={buildingOutlines}
          strokeColor="green"
          fillColor="rgba(255, 0, 200, 0.16)"
          strokeWidth={2}
          onPress={handleOutlinePress}
          tappable={true}
        />
        {visibleLayers.hall9RoomsPois && zoomLevel > ZOOM_LEVEL_THRESHOLD && (
          <Geojson
            geojson={hall9RoomsPois}
            image={markerImage}
            strokeColor="red"
            fillColor="rgba(255, 0, 0, 0.5)"
            strokeWidth={2}
            tappable={true}
            onPress={handleRoomPoiPress}
          />
        )}
        {visibleLayers.hall9FloorPlan && (
          <Geojson
            geojson={hall9FloorPlan}
            strokeColor="orange"
            fillColor="rgba(255, 165, 0, 0.5)"
            strokeWidth={2}
            tappable={true}
          />
        )}
        {results.features && (
          <Geojson
            geojson={results}
            strokeColor="#0066CC"
            fillColor="rgba(0, 102, 204, 0.5)"
            strokeWidth={3}
            lineDashPattern={[1]}
            tappable={true}
            onPress={handleSearchResultPress}
          />
        )}
        {results.features && results.features.map((feature: any) => (
          <Marker
            coordinate={{
              latitude: feature.geometry.coordinates[1],
              longitude: feature.geometry.coordinates[0],
            }}
            title={feature.properties.name || "POI"}
            key={feature.properties.place_id || Math.random().toString()}
            pinColor="blue"
            onPress={() => {
              handleSearchResultPress({
                feature: feature
              });
            }}
          />
        ))}
        {userLocation && (
          <>
            <Circle
              center={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
              radius={10}
              strokeColor="rgba(0, 122, 255, 0.3)"
              fillColor="rgb(0, 123, 255)"
            />
            <Circle
              center={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
              radius={50}
              strokeColor="rgba(0, 122, 255, 0.3)"
              fillColor="rgba(0, 122, 255, 0.1)"
            />
          </>
        )}
      </MapView>
      {showInfoBox && selectedCoordinate && selectedProperties && (
        <MarkerInfoBox
          coordinate={selectedCoordinate}
          title={selectedProperties.Building_Name || selectedProperties.BuildingName || "Building"}
          properties={selectedProperties}
          onClose={() => {
            setShowInfoBox(false);
            setSelectedMarker(null);
          }}
          onDirections={() => handleDirections(selectedProperties)}
        />
      )}
    </>
  );
};

// Define the type for the route parameters
type DirectionsRouteParams = {
  origin: {
    latitude: number;
    longitude: number;
  };
  destination: {
    Address: string;
    Latitude: number;
    Longitude: number;
  };
};

export default function MapExplorerScreen() {
  const mapRef = useRef<MapView | null>(null);
  const [results, setResults] = useState<any>({});
  
  // Add effect to log results when they change
  useEffect(() => {
    console.log("Results state updated:", results);
    console.log("Results has features:", results?.features?.length || 0);
  }, [results]);
  
  const [currentCampus, setCurrentCampus] = useState<Region>(SGW_CAMPUS);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [showInfoBox, setShowInfoBox] = useState(false);
  const [userLocation, setUserLocation] = useState<Region | null>(null);
  const [expanded, setExpanded] = useState(false);


  type RouteParams = {
    origin?: {
      latitude: number;
      longitude: number;
    };
    destination?: {
      Address: string;
      Latitude: number;
      Longitude: number;
    };
  };

  const route = useRoute<{ key: string; name: string; params: RouteParams }>();
  const { origin: originParam, destination: destinationParam } =
    route.params || {};

  const [visibleLayers, setVisibleLayers] = useState({
    hall9RoomsPois: true,
    hall9FloorPlan: true,
    hall8RoomsPois: true,
    hall8FloorPlan: true,
  });
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

  useEffect(() => {
    if (originParam) {
      setUserLocation({
        latitude: originParam.latitude,
        longitude: originParam.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }

    if (destinationParam) {
      setUserLocation({
        latitude: destinationParam.Latitude,
        longitude: destinationParam.Longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }
  }, [originParam, destinationParam]);

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

  const handlePress = () => setExpanded(!expanded);

  const toggleLayerVisibility = (layer: string) => {
    setVisibleLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <View style={DefaultMapStyle.container}>
      <MapComponent
        mapRef={mapRef}
        results={results}
        currentCampus={userLocation || currentCampus}
        userLocation={userLocation}

        setSelectedMarker={setSelectedMarker}

        visibleLayers={visibleLayers}

      />
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
        <List.Section>
          <List.Accordion
            title="Hall Building"
            left={props => <List.Icon {...props} icon="office-building" />}
            expanded={expanded}
            onPress={handlePress}
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
          >
            <ScrollView style={{ maxHeight: 400 }}>
              <List.Item 
                title="Hall 9" 
                left={props => <List.Icon {...props} icon="floor-plan" />} 
                style={{ backgroundColor: visibleLayers.hall9RoomsPois ? 'lightgray' : 'white' }} 
                onPress={() => {
                  setVisibleLayers({
                    hall9RoomsPois: false,
                    hall9FloorPlan: false,
                    hall8RoomsPois: false,
                    hall8FloorPlan: false,
                  });
                  toggleLayerVisibility('hall9RoomsPois');
                  toggleLayerVisibility('hall9FloorPlan');
                }}
              />
              <List.Item 
                title="Hall 8" 
                left={props => <List.Icon {...props} icon="floor-plan" />} 
                style={{ backgroundColor: visibleLayers.hall8RoomsPois ? 'lightgray' : 'white' }} 
                onPress={() => {
                  setVisibleLayers({
                    hall9RoomsPois: false,
                    hall9FloorPlan: false,
                    hall8RoomsPois: false,
                    hall8FloorPlan: false,
                  });
                  toggleLayerVisibility('hall8RoomsPois');
                  toggleLayerVisibility('hall8FloorPlan');
                }}
              />

            </ScrollView>
          </List.Accordion>
        </List.Section>
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
