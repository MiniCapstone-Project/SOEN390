import React, { useState, useRef, useEffect, useCallback } from "react";

import { View, Alert, ScrollView, Dimensions, Text, Modal, TouchableOpacity } from "react-native";
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

import { directionModalStyles, MapExplorerScreenStyles } from "@/Styles/MapExplorerScreenStyles";
import { searchPlaces } from "@/services/PlacesService";

const googleMapsKey = GOOGLE_MAPS_API_KEY;

// Add constants at the top of the file, near other constants
const POI_MIN_ZOOM_LEVEL = 12; // Minimum zoom level to show POIs (zoomed in)
const POI_MAX_ZOOM_LEVEL = 19; // Maximum zoom level for POIs (very zoomed in)
const POI_RADIUS_MIN = 500; // Minimum radius in meters
const POI_RADIUS_MAX = 5000; // Maximum radius in meters
const POI_ZOOM_REFRESH_THRESHOLD = 1.5; // How much zoom needs to change before refreshing POIs

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
  onRegionChangeComplete,
  shouldShowPOIs,
  currentSearchText,
  searchCleared
}: {
  mapRef: React.RefObject<MapView>;
  results: any;
  currentCampus: Region;
  userLocation: Region | null;
  setSelectedMarker: React.Dispatch<React.SetStateAction<any>>;
  visibleLayers: { [key: string]: boolean };
  onRegionChangeComplete: (region: Region) => void;
  shouldShowPOIs: boolean;
  currentSearchText: string;
  searchCleared: boolean;
}) => {

  const [selectedCoordinate, setSelectedCoordinate] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedProperties, setSelectedProperties] = useState<any>(null);
  const [showInfoBox, setShowInfoBox] = useState(false);
  const [directionModalVisible, setDirectionModalVisible] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(0);
  const navi = useNavigation();

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

 

  const handleMarkerPress = (markerData: any) => {
    console.log("Building marker pressed:", markerData);
  
    // Assuming markerData is the feature object
    const coordinates = markerData.geometry.coordinates;
  
    if (coordinates) {
      const [longitude, latitude] = coordinates;  
      const coordinate = { latitude, longitude };
  
      setSelectedCoordinate(coordinate);
      setSelectedProperties(markerData.properties
        ? { ...markerData.properties, coordinate }
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

    setDirectionModalVisible(true);
  };

  // Function to navigate to the Directions screen given the selected building
  const navigateToDirections = (origin: any, destination: any) => {
    // Null safety check added on the users location
    const destProps = destination === userLocation ? 
      {
        Address: "Your Location",
        Latitude: userLocation?.latitude ?? 0,
        Longitude: userLocation?.longitude ?? 0,
      } : 
      {
        Address: destination.Address || destination.Building_Long_Name || "Selected Location",
        Latitude: destination.coordinate.latitude,
        Longitude: destination.coordinate.longitude,
      };
      
    const originProps = origin === userLocation ?
      {
        latitude: userLocation?.latitude ?? 0,
        longitude: userLocation?.longitude ?? 0,
      } :
      {
        latitude: origin.coordinate.latitude,
        longitude: origin.coordinate.longitude,
      };
      
    navi.dispatch(
      CommonActions.navigate({
        name: 'Directions',
        params: {
          origin: originProps,
          destination: destProps,
        },
      })
    );
  };

  // Renders the direction modal after the user has pressed the directions button
  const renderDirectionModal = () => {
    return (
      <Modal
        visible={directionModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDirectionModalVisible(false)}
      >
        <View style={directionModalStyles.modalContainer}>
          <View style={directionModalStyles.modalContent}>
            <Text style={directionModalStyles.modalTitle}>Choose Direction</Text>
            
            <TouchableOpacity 
              style={directionModalStyles.modalButton}
              onPress={() => {
                setDirectionModalVisible(false);
                navigateToDirections(userLocation, selectedProperties);
              }}
            >
              <Text>Current Location → Selected Building</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={directionModalStyles.modalButton}
              onPress={() => {
                setDirectionModalVisible(false);
                navigateToDirections(selectedProperties, userLocation);
              }}
            >
              <Text>Selected Building → Current Location</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              // style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setDirectionModalVisible(false)}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };



  // This now just passes the region to the parent component
  const handleRegionChange = (region: Region) => {
    const zoom = Math.log2(360 * (Dimensions.get('window').width / 256 / region.longitudeDelta)) + 1;
    setZoomLevel(zoom);
    onRegionChangeComplete(region);
  };

  return (
    <>
    {renderDirectionModal()}
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
        onRegionChangeComplete={handleRegionChange}
      >
        {/* Building markers */}
    
             {buildingMarkers.features.map((feature: any) => (
          <Marker
            coordinate={{
              latitude: feature.geometry.coordinates[1],
              longitude: feature.geometry.coordinates[0],
            }}
            title={feature.properties.Building_Name || "POI"}
            key={feature.properties.place_id || Math.random().toString()}
            pinColor="red"
           onPress={() => {
              handleMarkerPress(feature);
            }}
          />
        ))}

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
        {/* Search Results GeoJSON */}
        {!searchCleared && 
          results.features && 
          shouldShowPOIs && 
          currentSearchText && 
          currentSearchText.trim() !== "" && 
          results.features.length > 0 && (
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
        
        {/* Search Results as Markers for better visibility */}
        {!searchCleared && 
          results.features && 
          shouldShowPOIs && 
          currentSearchText && 
          currentSearchText.trim() !== "" && 
          results.features.length > 0 && 
          results.features.map((feature: any) => (
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

// THIS IS NEVER USED - REMOVE IT
// Define the type for the route parameters
// type DirectionsRouteParams = {
//   origin: {
//     latitude: number;
//     longitude: number;
//   };
//   destination: {
//     Address: string;
//     Latitude: number;
//     Longitude: number;
//   };
// };

export default function MapExplorerScreen() {
  const mapRef = useRef<MapView | null>(null);
  const [results, setResults] = useState<any>({});
  const [searchRadius, setSearchRadius] = useState<number>(1500); // Default search radius in meters
  const lastZoomRef = useRef<number>(0);
  const [shouldShowPOIs, setShouldShowPOIs] = useState<boolean>(false);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [currentSearchText, setCurrentSearchText] = useState<string>("");
  // Add a flag to completely disable POI updates after clearing
  const [searchCleared, setSearchCleared] = useState<boolean>(true);
  const [currentCampus, setCurrentCampus] = useState<Region>(SGW_CAMPUS);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [showInfoBox, setShowInfoBox] = useState(false);
  const [userLocation, setUserLocation] = useState<Region | null>(null);
  const [expanded, setExpanded] = useState(false);
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

    // Add debugging for search radius changes
    useEffect(() => {
      console.log(`Search radius updated to ${searchRadius}m`);
      // When search radius updates, update any UI elements that depend on it
    }, [searchRadius]);
    
    // Add debugging for search text changes
    useEffect(() => {
      console.log(`Current search text updated: "${currentSearchText}"`);
      if (currentSearchText) {
        // When a new search is performed, enable POI updates
        setSearchCleared(false);
        // When a new search is performed, apply the current search radius
        searchPOIs();
      } else {
        // When search text is cleared, do a complete reset of all POI-related state
        setResults({
          type: "FeatureCollection",
          features: []
        });
        
        // Set the cleared flag to true to disable POI updates on zoom
        setSearchCleared(true);
        
        // Cancel any pending searches
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current);
          refreshTimeoutRef.current = null;
        }
        
        // Reset search-related state
        setSelectedMarker(null);
        setShowInfoBox(false);
        
        console.log("COMPLETE RESET: Cleared all search results and state due to empty search text");
      }
    }, [currentSearchText]);
    // Add effect to log results when they change
    useEffect(() => {
      console.log("Results state updated:", results);
      console.log("Results has features:", results?.features?.length || 0);
    }, [results]);

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

    // Effect to refresh POIs when search radius changes significantly
    useEffect(() => {
      // Skip initial render or if search has been cleared
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      
      // Skip everything if search has been cleared
      if (searchCleared) {
        console.log("Skipping search radius effect - search has been cleared");
        return;
      }
      
      // Only trigger search if we already have a search and POIs should be visible
      if (!currentSearchText || !shouldShowPOIs) {
        return;
      }
      
      // Use a longer timeout to allow for multiple zoom changes before refreshing
      refreshTimeoutRef.current = setTimeout(() => {
        // Store the current search radius to compare later
        const currentRadiusSnapshot = searchRadius;
        
        // Only perform search if radius is still the same (no more zooming in progress)
        setTimeout(() => {
          if (currentRadiusSnapshot === searchRadius && currentSearchText) {
            console.log(`Refreshing POIs after search radius settled at ${searchRadius}m`);
            searchPOIs();
          }
        }, 300);
      }, 1000);
      
      return () => {
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current);
        }
      };
    }, [searchRadius, searchPOIs, currentSearchText, shouldShowPOIs]);

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

  // Functions are not being used, so they can be removed
  // const handlePress = () => setExpanded(!expanded);
  // const toggleLayerVisibility = (layer: string) => {
  //   setVisibleLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  // };

  // Function to trigger a POI search with the current radius
  const searchPOIs = useCallback(() => {
    // Skip everything if search has been cleared
    if (searchCleared) {
      console.log("Skipping POI search - search has been cleared");
      return;
    }
    
    // CRITICAL CHECK: Do not search if no search text
    if (!currentSearchText || currentSearchText.trim() === "") {
      console.log("Prevented POI search - no search text");
      // Ensure results are cleared
      setResults({
        type: "FeatureCollection",
        features: []
      });
      return;
    }
    
    if (!shouldShowPOIs) {
      console.log("Prevented POI search - POIs should not be shown at current zoom level");
      return;
    }
    
    console.log(`Searching for "${currentSearchText}" with radius ${searchRadius}m`);
    
    // Use a flag to prevent multiple simultaneous searches
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
    
    // Set a loading indicator or similar if needed
    
    const performSearch = async () => {
      try {
        const geojson = await searchPlaces(
          currentSearchText,
          userLocation?.latitude || currentCampus.latitude,
          userLocation?.longitude || currentCampus.longitude,
          googleMapsKey,
          searchRadius
        );
        
        if (geojson.features.length === 0) {
          console.log("No results found");
          return;
        }
        
        // Compare with existing results to avoid unnecessary re-renders
        if (JSON.stringify(results) !== JSON.stringify(geojson)) {
          setResults(geojson);
          console.log(`Found ${geojson.features.length} POIs`);
        } else {
          console.log("Results unchanged, skipping update");
        }
      } catch (error) {
        console.error("Error searching for POIs:", error);
      }
    };
    
    performSearch();
  }, [currentSearchText, searchRadius, shouldShowPOIs, userLocation, currentCampus, googleMapsKey, results]);
  
  
  // Update the handleMapRegionChange function to use searchPOIs
  const handleMapRegionChange = (region: Region) => {
    // SKIP EVERYTHING if search has been cleared - critical fix!
    if (searchCleared) {
      console.log("Skipping region change processing - search is cleared");
      return;
    }
    
    const zoom = Math.log2(360 * (Dimensions.get('window').width / 256 / region.longitudeDelta)) + 1;
    
    // Only process if zoom changed significantly (more than 0.5 levels)
    const zoomDifference = Math.abs(zoom - lastZoomRef.current);
    if (zoomDifference < 0.5) {
      return; // Exit early if zoom hasn't changed enough
    }
    
    // Calculate dynamic search radius based on zoom level
    let newRadius;
    let shouldShowPOIsNew = shouldShowPOIs;
    
    if (zoom < POI_MIN_ZOOM_LEVEL) {
      // Too zoomed out, hide POIs
      shouldShowPOIsNew = false;
      newRadius = POI_RADIUS_MAX;
    } else if (zoom > POI_MAX_ZOOM_LEVEL) {
      // Very zoomed in, use minimum radius
      shouldShowPOIsNew = true;
      newRadius = POI_RADIUS_MIN;
    } else {
      // In between, calculate proportional radius
      shouldShowPOIsNew = true;
      const zoomRange = POI_MAX_ZOOM_LEVEL - POI_MIN_ZOOM_LEVEL;
      const zoomFactor = (zoom - POI_MIN_ZOOM_LEVEL) / zoomRange;
      newRadius = POI_RADIUS_MAX - (zoomFactor * (POI_RADIUS_MAX - POI_RADIUS_MIN));
    }
    
    // Check if we need to update the search radius and requery
    const radiusChange = Math.abs(newRadius - searchRadius) / searchRadius;
    const shouldUpdateRadius = radiusChange > 0.2; // 20% change
    
    // Prevent unnecessary state updates
    if (shouldShowPOIsNew !== shouldShowPOIs) {
      setShouldShowPOIs(shouldShowPOIsNew);
    }
    
    if (shouldUpdateRadius) {
      // Only update search radius if it changed significantly
      setSearchRadius(Math.round(newRadius));
      
      // Trigger a new POI search if there's an active search and zoom changed significantly
      if (currentSearchText && zoomDifference > 1.0) {
        // More aggressive debouncing to prevent rapid re-renders
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current);
        }
        
        refreshTimeoutRef.current = setTimeout(() => {
          console.log(`Zoom changed by ${zoomDifference}, refreshing POIs with radius ${newRadius}m`);
          searchPOIs();
        }, 800); // Longer delay to avoid rapid searches
      }
    }
    
    lastZoomRef.current = zoom;
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
        onRegionChangeComplete={handleMapRegionChange}
        shouldShowPOIs={shouldShowPOIs}
        currentSearchText={currentSearchText}
        searchCleared={searchCleared}
      />
      <View
        pointerEvents="box-none"
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
          onSearchTextChange={setCurrentSearchText}
          
        />
      </View>
      
      {/* Zoom indicator - shows when user searches for POIs but is zoomed out too far */}
      {currentSearchText && !shouldShowPOIs && results.features && results.features.length > 0 && (
        <View style={{
          position: 'absolute',
          bottom: 100,
          alignSelf: 'center',
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: 10,
          borderRadius: 5,
          zIndex: 1000,
        }}>
          <Text style={{ color: 'white', textAlign: 'center' }}>
            Zoom in to see POIs
          </Text>
        </View>
      )}

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
