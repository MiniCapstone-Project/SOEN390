import { LatLng } from "react-native-maps";

export const searchPlaces = async (
  searchText: string,
  initialLat: number,
  initialLng: number,
  apiKey: string
): Promise<{ results: any[]; coords: LatLng[] }> => {
  if (!searchText.trim()) return { results: [], coords: [] };

  const location = `${initialLat},${initialLng}`;
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchText}&location=${location}&radius=50&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const json = await response.json();
    const coords: LatLng[] = json.results.map((item: any) => ({
      latitude: item.geometry.location.lat,
      longitude: item.geometry.location.lng,
    }));

    return { results: json.results, coords };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch places");
  }
};
