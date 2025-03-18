import { Dimensions } from "react-native";
import { Region } from "react-native-maps";


export const { width, height } = Dimensions.get("window");
export const ASPECT_RATIO = width / height;
export const LATITUDE_DELTA = 0.02;
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// Define campus regions
export const SGW_CAMPUS: Region = {
    latitude: 45.497092,
    longitude: -73.5788,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };
  
  export const LOY_CAMPUS: Region = {
    latitude: 45.458705,
    longitude: -73.640523,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };