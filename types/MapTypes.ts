export type MarkerInfoBoxProps = {
    title: string;
    address: string;
    onClose: () => void;
    onDirections: () => void;
  };

export type RadiusSliderProps = {
  searchRadius: number;
  setSearchRadius: (radius: number) => void;
}

export interface POIDetails {
    name: string;
    address: string;
    openingHours?: {
        isOpen: boolean;
        periods?: {
            open: { day: number; time: string };
            close: { day: number; time: string };
        }[];
        weekdayText?: string[];
    };
    phoneNumber?: string;
    rating?: number;
    types?: string[];
    website?: string;
    photos?: string[];
}