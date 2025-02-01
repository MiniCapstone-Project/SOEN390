import React, { useRef, forwardRef } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { StyleSheet, Dimensions } from 'react-native';

type CustomMapProps = {
  initialRegion: Region;
  markers: Array<{ latitude: number; longitude: number; title: string }>;
};

// Use forwardRef to allow refs to be passed properly
const CustomMap = forwardRef<MapView, CustomMapProps>(({ initialRegion, markers }, ref) => {
  return (
    <MapView
      ref={ref} // Now it works!
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={initialRegion}
      testID="custom-map"
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
      {markers.map((marker, index) => (
        <Marker
          key={`marker-${index}`}
          coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
          title={marker.title}
          testID={`map-marker-${index}`}
        />
      ))}
    </MapView>
  );
});

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
});

export default CustomMap;
