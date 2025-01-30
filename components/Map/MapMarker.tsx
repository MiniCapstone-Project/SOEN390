import React from 'react';
import { Marker } from 'react-native-maps';

type MapMarkerProps = {
  coordinate: { latitude: number; longitude: number };
  title: string;
};

const MapMarker: React.FC<MapMarkerProps> = ({ coordinate, title }) => {
  return <Marker coordinate={coordinate} title={title} />;
};

export default MapMarker;