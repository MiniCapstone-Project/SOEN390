export interface MarkerItem {
    Latitude?: number;
    Longitude?: number;
    geometry?: {
      location?: {
        lat: number;
        lng: number;
      };
    };
    BuildingName?: string;
    name?: string;
    id?: string | number; // If available, better than using index for keys
  }
  
export interface CustomMarkersProps {
    data: MarkerItem[];
    handleMarkerPress: (marker: MarkerItem) => void;
} 

export type SwitchButtonsProps = {
    onSwitchToSGW: () => void; // Function type for the SGW button
    onSwitchToLoyola: () => void; // Function type for the Loyola button
};

export type MapMarkerProps = {
  coordinate: { latitude: number; longitude: number };
  title: string;
};