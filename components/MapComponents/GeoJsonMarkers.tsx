import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import React from 'react';
import { Marker } from 'react-native-maps';


export const GeoJsonMarkers = ({ buildingMarkers }) => {
  return buildingMarkers.features.map((feature: any) => {
    if (feature.geometry.type === 'Point') {
      return (
        <Marker
                    coordinate={{
                      latitude: feature.geometry.coordinates[1],
                      longitude: feature.geometry.coordinates[0],
                    }}
                    title={feature.properties.name || "noName"}
                    key={feature.properties.place_id || Math.random().toString()}
                    pinColor="red"
                  />
      );
    }
    return null;
  });
};
