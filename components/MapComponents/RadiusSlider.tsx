import { DefaultMapStyle } from "@/Styles/MapStyles";
import Slider from "@react-native-community/slider"; // ✅ Switch to new library
import { View, Text } from "react-native";
import { RadiusSliderProps } from "@/types/MapTypes";

const RadiusSlider: React.FC<RadiusSliderProps> = ({ 
  searchRadius = 500, 
  setSearchRadius 
}) => {
  return (
    <View style={{ padding: 10, backgroundColor: "white", borderRadius: 10 }}>
      <Slider
        value={searchRadius}
        onValueChange={(value) => setSearchRadius(value)} // Ensure state updates
        minimumValue={250}
        maximumValue={1000}
        step={50}
        thumbTintColor="#FF5733"
      />
      <Text>Radius: {searchRadius}m</Text>
    </View>
  );
}; 
export default RadiusSlider;
