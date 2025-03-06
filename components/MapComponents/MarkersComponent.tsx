import React from "react";
import { CustomMarkersProps } from "@/types/MapComponentTypes";
import { Marker } from "react-native-maps";
import { View } from "react-native";

// For displaying a set of markers
export const CustomMarkersComponent: React.FC<CustomMarkersProps> = ({
  data,
  handleMarkerPress,
}) => {
  return (
    <>
      {data &&
        data.length > 0 &&
        data.map((item, index) => {
          const latitude = item.Latitude ?? item.geometry?.location?.lat;
          const longitude = item.Longitude ?? item.geometry?.location?.lng;

          if (latitude === undefined || longitude === undefined) return null;

          return (
            <Marker
              key={`data-marker-${index}`}
              coordinate={{ latitude, longitude }}
              title={item.name || `Location ${index}`}
              description={item.formatted_address || ""}
              pinColor="#FF0000"
              onPress={() => {
                handleMarkerPress({
                  name: item.name || `Location ${index}`,
                  formatted_address: item.formatted_address || "",
                  ...item,
                });

                return false;
              }}
            />
          );
        })}
    </>
  );
};
