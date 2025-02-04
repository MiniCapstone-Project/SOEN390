import React, { useState, useRef } from "react";
import { View, StyleSheet, Keyboard, Dimensions } from "react-native";
import MapView, { LatLng, Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { SearchBar } from "@/components/InputComponents/InputFields";
import { DefaultMapStyle } from "@/Styles/MapStyles";
import CustomButton from "../components/InputComponents/Buttons";
import MarkerInfoBox from "../components/MapComponents/MarkerInfoBox";
import { searchPlaces } from "../services/PlacesService";
import buildings from "@/Cartography/BuildingCampusMarkers";

const googleMapsKey: string = process.env.GOOGLE_MAPS_API_KEY!; // Asserts that it's always defined

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const SGW_CAMPUS: Region = {
  latitude: 45.497092,
  longitude: -73.5788,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

const LOY_CAMPUS: Region = {
  latitude: 45.458705,
  longitude: -73.640523,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

export default function MapExplorerScreen() {
  const mapRef = useRef<MapView | null>(null);
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [currentCampus, setCurrentCampus] = useState<Region>(SGW_CAMPUS);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [showInfoBox, setShowInfoBox] = useState(false);

  const handleSearch = async () => {
    try {
      const { results, coords } = await searchPlaces(
        searchText,
        currentCampus.latitude,
        currentCampus.longitude,
        googleMapsKey
      );
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
      // Double click
      setShowInfoBox(true);
    } else {
      // Single click
      setSelectedMarker(marker);
      setShowInfoBox(false);
    }
  };

  const handleCloseInfoBox = () => {
    setShowInfoBox(false);
    setSelectedMarker(null);
  };

  const handleDirections = () => {
    // TODO: Implement directions functionality
    console.log("Directions button pressed");
  };

  return (
    <View style={DefaultMapStyle.container}>
      <MapComponent
        mapRef={mapRef}
        results={results}
        currentCampus={currentCampus}
        selectedMarker={selectedMarker}
        handleMarkerPress={handleMarkerPress}
      />
      <SearchWrapper
        searchText={searchText}
        setSearchText={setSearchText}
        handleSearch={handleSearch}
        handleClearSearch={handleClearSearch}
        handleSwitchToSGW={handleSwitchToSGW}
        handleSwitchToLoyola={handleSwitchToLoyola}
      />
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

const BuildingMarkers = ({
  handleMarkerPress,
}: {
  handleMarkerPress: (marker: any) => void;
}) => {
  return buildings.map(
    (
      building: {
        Latitude: any;
        Longitude: any;
        BuildingName: string | undefined;
        Campus: string;
      },
      index: any
    ) => (
      <Marker
        key={`building-${index}`}
        coordinate={{
          latitude: building.Latitude,
          longitude: building.Longitude,
        }}
        title={building.BuildingName}
        pinColor="#4A90E2"
        onPress={() => handleMarkerPress(building)}
      />
    )
  );
};

const SeachResultsMarkers = ({
  results,
  handleMarkerPress,
}: {
  results: any[];
  handleMarkerPress: (marker: any) => void;
}) => {
  return results.map((item, index) => (
    <Marker
      key={`marker-${index}`}
      coordinate={{
        latitude: item.geometry.location.lat,
        longitude: item.geometry.location.lng,
      }}
      title={item.name}
      onPress={() => handleMarkerPress(item)}
    />
  ));
};

const SearchWrapper = ({
  searchText,
  setSearchText,
  handleSearch,
  handleClearSearch,
  handleSwitchToSGW,
  handleSwitchToLoyola,
}: {
  searchText: string;
  setSearchText: (text: string) => void;
  handleSearch: () => void;
  handleClearSearch: () => void;
  handleSwitchToSGW: () => void;
  handleSwitchToLoyola: () => void;
}) => {
  return (
    <View style={DefaultMapStyle.controlsContainer}>
      <SearchBar
        searchText={searchText}
        onSearchTextChange={setSearchText}
        onSearchPress={handleSearch}
        onClearPress={handleClearSearch}
        style={DefaultMapStyle.searchBox}
      />

      <View style={DefaultMapStyle.campusButtons}>
        <CustomButton
          title="Switch to SGW"
          onCampusSwitch={handleSwitchToSGW}
          style={DefaultMapStyle.campusButton}
        />
        <CustomButton
          title="Switch to Loyola"
          onCampusSwitch={handleSwitchToLoyola}
          style={DefaultMapStyle.campusButton}
        />
      </View>
    </View>
  );
};

const MapComponent = ({
  mapRef,
  results,
  currentCampus,
  selectedMarker,
  handleMarkerPress,
}: {
  mapRef: React.RefObject<MapView>;
  results: any[];
  currentCampus: Region;
  selectedMarker: any;
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
      <SeachResultsMarkers
        results={results}
        handleMarkerPress={handleMarkerPress}
      />
      <BuildingMarkers handleMarkerPress={handleMarkerPress} />
    </MapView>
  );
};
