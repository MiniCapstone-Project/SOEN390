import { MapMarkerProps } from '@/types/MapComponentTypes';
import React from 'react';
import { Marker } from 'react-native-maps';

const MapMarker: React.FC<MapMarkerProps> = ({ coordinate, title }) => {
  return <Marker coordinate={coordinate} title={title} />;
};

export default MapMarker;