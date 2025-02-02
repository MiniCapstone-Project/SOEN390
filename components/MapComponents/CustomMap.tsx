import React, { useRef } from 'react';
import MapView, { LatLng, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { StyleSheet, Dimensions } from 'react-native';

type CustomMapProps = {
  initialRegion: Region;
  markers: Array<{ latitude: number; longitude: number; title: string }>;
};

const { width, height } = Dimensions.get('window');

const CustomMap: React.FC<CustomMapProps> = ({ initialRegion, markers }) => {
  const mapRef = useRef<MapView | null>(null);

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={initialRegion}
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
        />
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
});

export default CustomMap;