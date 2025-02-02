import React, { useState, useRef } from "react";
import { View, StyleSheet, Keyboard, Dimensions } from "react-native";
import MapView, {
  LatLng,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  }
});

function Map({children}: {children: React.ReactNode}) {
  const mapRef = useRef<MapView | null>(null);
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

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={SGW_CAMPUS}
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
}

export default Map;
