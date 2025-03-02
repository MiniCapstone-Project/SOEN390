import { PlacesAPIError } from "@/errors/PlacesAPIError";
import { LatLng } from "react-native-maps";
import { PlaceResult, SearchPlacesResponse } from "@/types/PlacesTypes";

export const searchPlaces = async (
  searchText: string,
  initialLat: number,
  initialLng: number,
  apiKey: string,
  radius: number
): Promise<SearchPlacesResponse> => {
  if (!searchText.trim()) return { results: [], coords: [] };

  const location = `${initialLat},${initialLng}`;
  const encodedSearchText = encodeURIComponent(searchText);
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodedSearchText}&location=${location}&radius=${radius}&type=point_of_interest&key=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new PlacesAPIError(
        `Failed to fetch places - HTTP ${response.status}`,
        response.status
      );
    }

    const json = await response.json();

    if (!json || !json.results || !Array.isArray(json.results)) {
      throw new PlacesAPIError("Invalid API response structure");
    }

    if (json.results.length === 0 || json.status === "ZERO_RESULTS") {
      return { results: [], coords: [] }; // No POIs found
    }

    const results: PlaceResult[] = json.results.map((item: any) => ({
      name: item.name,
      geometry: item.geometry,
      formatted_address: item.formatted_address,
      place_id: item.place_id,
    }));

    const coords: LatLng[] = results.map((place) => ({
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
    }));

    return { results, coords };
  } catch (error) {
    console.error("Error fetching places:", error);

    if (error instanceof PlacesAPIError) {
      throw error; // Rethrow API-specific errors
    }

    throw new PlacesAPIError("Unexpected error fetching places");
  }
};
