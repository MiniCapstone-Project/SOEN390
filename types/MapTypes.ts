
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