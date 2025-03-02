import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Keyboard, Dimensions, Alert } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region, Geojson } from "react-native-maps";
import { SearchBar } from "@/components/InputComponents/InputFields";
import { DefaultMapStyle } from "@/Styles/MapStyles";
import CustomButton from "../components/InputComponents/Buttons";
import MarkerInfoBox from "../components/MapComponents/MarkerInfoBox";
import { searchPlaces } from "../services/PlacesService";
import { GOOGLE_MAPS_API_KEY } from "@/constants/GoogleKey";
import { useNavigation } from "@react-navigation/native";
import buildingMarkers from "@/gis/building-markers.json"; // Updated import path
import { Button } from 'react-native-paper';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from 'expo-location';

const googleMapsKey = GOOGLE_MAPS_API_KEY ; 
// const googleMapsKey: string = process. env.GOOGLE_MAPS_API_KEY!;

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


// for defining the campus toggleing regions
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


// for displaying a set of markers: will likely get phased out in favor of the Geojson component
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


// wrapper for the <MapView> component
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
      <Geojson
        geojson={buildingMarkers}
        strokeColor="blue"
        fillColor="cyan"
        strokeWidth={2}
      />
    </MapView>
  );
};

const SearchWrapper = ({
  searchText,
  setSearchText,
  handleSearch,
  handleClearSearch,
}: {
  searchText: string;
  setSearchText: (text: string) => void;
  handleSearch: () => void;
  handleClearSearch: () => void;
}) => {
  return (
    <View style={styles.searchWrapper}>
      <SearchBar
        searchText={searchText}
        onSearchTextChange={setSearchText}
        onSearchPress={handleSearch}
        onClearPress={handleClearSearch}
        style={DefaultMapStyle.searchBox}
        placeholder="Search Places"
      />
      <GooglePlacesAutocomplete
        placeholder="Search"
        currentLocation={true}
        predefinedPlacesAlwaysVisible={true}
        onPress={(data, details=null) => {
          console.log("Selected place:", data, details);
          // if (details) {
          //   const position = {
          //     latitude: details.geometry.location.lat,
          //     longitude: details.geometry.location.lng,
          //   };
          //   mapRef.current?.animateToRegion({
          //     ...position,
          //     latitudeDelta: LATITUDE_DELTA,
          //     longitudeDelta: LONGITUDE_DELTA,
          //   }, 1000);
          //   setResults([details]);
          // }
        }}
        query={{ key: GOOGLE_MAPS_API_KEY, language: "en" }}
        styles={{ container: { flex: 0, marginTop: 10 }, textInput: DefaultMapStyle.searchBox }}
      />
    </View>
  );
};

export default function MapExplorerScreen() {
  const mapRef = useRef<MapView | null>(null);
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [currentCampus, setCurrentCampus] = useState<Region>(SGW_CAMPUS);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [showInfoBox, setShowInfoBox] = useState(false);
  const [userLocation, setUserLocation] = useState<Region | null>(null);
  const navi = useNavigation();

  useEffect(() => {
    (async () => {
      console.log("Requesting location permissions..."); // Debug log
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log("Location permission status:", status); // Debug log
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      try {
        console.log("Fetching user location..."); // Debug log
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
          maximumAge: 10000,
          timeout: 5000,
        });
        console.log("User location:", location); // Debug log
        const { latitude, longitude } = location.coords;
        const userRegion = {
          latitude,
          longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
        setUserLocation(userRegion);
        mapRef.current?.animateToRegion(userRegion, 1000);
      } catch (error) {
        console.error("Error getting location:", error); // Debug log
      }
    })();
  }, []);

  const handleSearch = async () => {
    try {
      const { results, coords } = await searchPlaces(
        searchText,
        currentCampus.latitude,
        currentCampus.longitude,
        googleMapsKey
      );
      if (results.length === 0) {
        Alert.alert("No Results", "No locations found. Try a different search.", [
          { text: "OK", onPress: () => console.log("Alert closed") },
        ]);
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
      console.error("Error during search:", error);
      Alert.alert("Error", "Failed to fetch places. Please try again.");
    }
  };

  const handleClearSearch = () => {
    setSearchText("");
    setResults([]);
  };

  const handleSwitchToSGW = () => {
    setCurrentCampus(SGW_CAMPUS);
    mapRef.current?.animateToRegion(SGW_CAMPUS, 1000);
  };

  const handleSwitchToLoyola = () => {
    setCurrentCampus(LOY_CAMPUS);
    mapRef.current?.animateToRegion(LOY_CAMPUS, 1000);
  };

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
      console.log("Selected marker ", selectedMarker)
    navi.navigate("Directions", // navigate to directions screen
        {destination: selectedMarker});
        // pass address as destination
  };

  const handleCenterToUserLocation = () => {
    console.log("Centering to user location:", userLocation); // Debug log
    if (userLocation) {
      mapRef.current?.animateToRegion(userLocation, 1000);
    } else {
      Alert.alert("Location not available", "User location is not available yet.");
    }
  };

  return (
    <View style={DefaultMapStyle.container}>
      <MapComponent
        mapRef={mapRef}
        results={results}
        currentCampus={userLocation || currentCampus}
        handleMarkerPress={handleMarkerPress}
      />
      <View style={styles.controlsContainer}>
        <SearchWrapper
          searchText={searchText}
          setSearchText={setSearchText}
          handleSearch={handleSearch}
          handleClearSearch={handleClearSearch}
        />
        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={() => { console.log('SGW button pressed'); handleSwitchToSGW(); }} style={styles.button}>
            SGW
          </Button>
          <Button mode="contained" onPress={() => { console.log('Loyola button pressed'); handleSwitchToLoyola(); }} style={styles.button}>
            Loyola
          </Button>
          <Button mode="contained" onPress={() => { console.log('ME button pressed'); handleCenterToUserLocation(); }} style={styles.button}>
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

const styles = StyleSheet.create({
  controlsContainer: {
    position: "absolute",
    top: 10,
    width: "90%",
    alignSelf: "center",
    flexDirection: "column",
  },
  searchWrapper: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});