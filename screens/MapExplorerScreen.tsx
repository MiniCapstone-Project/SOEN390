/**
 * This screen will be our main Map where the user iteacts 
 */

import React, { useRef, useState } from 'react';
import MapView, { LatLng, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Dimensions, StyleSheet, TextInput, TouchableOpacity, View, Text, Keyboard } from 'react-native';
import { GOOGLE_MAPS_API_KEY } from '../GoogleKey';
import { searchPlaces } from '@/services/PlacesService';

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const INITIAL_LAT = 28.46254;
const INITIAL_LNG = -81.397272;
const INITIAL_POS = {
  latitude: INITIAL_LAT,
  longitude: INITIAL_LNG,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

const SGW_CAMPUS: Region = {
  latitude: 45.497092,
  longitude: -73.578800,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const LOY_CAMPUS: Region = {
  latitude: 45.458705,
  longitude: -73.640523,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export default function MapExplorerScreen() {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const map = useRef<MapView | null>(null);

  const handleSearch = async () => {
    try {
      const { results, coords } = await searchPlaces(searchText, INITIAL_LAT, INITIAL_LNG, GOOGLE_MAPS_API_KEY);
      setResults(results);

      if (coords.length) {
        map.current?.fitToCoordinates(coords, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
        Keyboard.dismiss();
      }
    } catch (error) {
      console.error("Error during search:", error);
    }
  };
  // const searchPlaces = async () => {
  //   if (!searchText.trim()) return;

  //   const location = `${INITIAL_LAT},${INITIAL_LNG}`;
  //   const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchText}&location=${location}&radius=500&key=${GOOGLE_MAPS_API_KEY}`;

  //   try {
  //     const response = await fetch(url);
  //     const json = await response.json();
  //     const coords: LatLng[] = json.results.map((item: any) => ({
  //       latitude: item.geometry.location.lat,
  //       longitude: item.geometry.location.lng,
  //     }));

  //     setResults(json.results);

  //     if (coords.length) {
  //       map.current?.fitToCoordinates(coords, {
  //         edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
  //         animated: true,
  //       });
  //       Keyboard.dismiss();
  //     }
  //     // setSearchText('');
  //     // this needs to be discussed as it will have some reflection on the UX  
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <View style={styles.container}>
      <MapView 
          ref={map} 
          style={styles.map} 
          provider={PROVIDER_GOOGLE} 
          initialRegion={INITIAL_POS}
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
          ]}>
        {results.map((item, i) => (
          <Marker
            key={`marker-${i}`}
            coordinate={{
              latitude: item.geometry.location.lat,
              longitude: item.geometry.location.lng,
            }}
            title={item.name}
          />
        ))}
      </MapView>
        <View style={styles.searchBox}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Search place"
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>SWG</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>LOY</Text>
            </TouchableOpacity>
          </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  searchBox: {
    position: 'absolute',
    top: 10,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
  },
  button: {
    flex: 1,
    backgroundColor: '#722F37',
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: '#722F37',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginLeft: 10,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
