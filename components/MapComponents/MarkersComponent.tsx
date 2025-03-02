import { Marker } from "react-native-maps";

// For displaying a set of markers
export const CustomMarkersComponent = ({
    data,
    handleMarkerPress,
  }: {
    data: any[];
    handleMarkerPress: (marker: any) => void;
  }) => {
    return data.map((item, index) => (
      <Marker
        key={`marker-${index}`}
        coordinate={{
          latitude: item.Latitude || item.geometry?.location?.lat,
          longitude: item.Longitude || item.geometry?.location?.lng,
        }}
        title={item.BuildingName || item.name}
        pinColor={item.BuildingName ? "#4A90E2" : "#FF5733"}
        onPress={() => handleMarkerPress(item)}
      />
    ));
  };