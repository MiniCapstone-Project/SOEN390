import { LatLng } from "react-native-maps";

export interface PlaceResult {
    name: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    formatted_address?: string;
    place_id: string;
  }
  
  export interface SearchPlacesResponse {
    results: PlaceResult[];
    coords: LatLng[];
  }
  