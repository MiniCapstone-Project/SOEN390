import { CustomMarkersProps } from "@/types/MapComponentTypes";
import { Marker } from "react-native-maps";

// For displaying a set of markers
export const CustomMarkersComponent: React.FC<CustomMarkersProps> = ({
  data,
  handleMarkerPress,
}) => {
  return (
    <>
      {data.map((item, index) => {
        const latitude = item.Latitude ?? item.geometry?.location?.lat;
        const longitude = item.Longitude ?? item.geometry?.location?.lng;

        if (latitude === undefined || longitude === undefined) return null;

        return (
          <Marker
            key={item.id ? `marker-${item.id}` : `marker-${index}`}
            coordinate={{ latitude, longitude }}
            title={item.BuildingName || item.name}
            pinColor={item.BuildingName ? "#4A90E2" : "#FF5733"}
            onPress={() => handleMarkerPress(item)}
          />
        );
      })}
    </>
  );
};