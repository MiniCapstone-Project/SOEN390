import React, { useState, useRef } from 'react';
import { View, StyleSheet, Keyboard, Dimensions } from 'react-native';
import MapView, { LatLng, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import SearchBar from '../components/SearchBar';
import CustomButton from '../components/CustomButton';
import MarkerInfoBox from '../components/MarkerInfoBox';
import { searchPlaces } from '../services/PlacesService';
import { GOOGLE_MAPS_API_KEY } from '../GoogleKey';
import buildings  from '../Cartography/BuildingCampusMarkers';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const SGW_CAMPUS: Region = {
  latitude: 45.497092,
  longitude: -73.578800,
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
  const [searchText, setSearchText] = useState('');
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
        GOOGLE_MAPS_API_KEY
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
      console.error('Error during search:', error);
    }
  };

  const handleClearSearch = () => {
    setSearchText('');
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
    console.log('Directions button pressed');
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={SGW_CAMPUS}
        customMapStyle={[
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
          {
            featureType: 'poi.business',
            stylers: [{ visibility: 'off' }],
          },
        ]}
      >
        {results.map((item, index) => (
          <Marker
            key={`marker-${index}`}
            coordinate={{
              latitude: item.geometry.location.lat,
              longitude: item.geometry.location.lng,
            }}
            title={item.name}
            onPress={() => handleMarkerPress(item)}
          />
        ))}
        {buildings.map((building: { Latitude: any; Longitude: any; BuildingName: string | undefined; Campus: string; }, index: any) => (
          <Marker
            key={`building-${index}`}
            coordinate={{
              latitude: building.Latitude,
              longitude: building.Longitude,
            }}
            title={building.BuildingName}
            pinColor="#4A90E2"// Different colors for SGW and Loyola
            onPress={() => handleMarkerPress(building)}
          />
        ))}
      </MapView>

      <View style={styles.controlsContainer}>
        <SearchBar
          searchText={searchText}
          onSearchTextChange={setSearchText}
          onSearchPress={handleSearch}
          onClearPress={handleClearSearch}
          style={styles.searchBox}
        />

        <View style={styles.campusButtons}>
          <CustomButton
            title="Switch to SGW"
            onPress={handleSwitchToSGW}
            style={styles.campusButton}
          />
          <CustomButton
            title="Switch to Loyola"
            onPress={handleSwitchToLoyola}
            style={styles.campusButton}
          />
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
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  controlsContainer: {
    position: 'absolute',
    top: 10,
    width: '90%',
    alignSelf: 'center',
  },
  searchBox: {
    marginBottom: 10,
  },
  campusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  campusButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});