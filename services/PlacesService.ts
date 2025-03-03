import { PlacesAPIError } from "@/errors/PlacesAPIError";
import { LatLng } from "react-native-maps";
import { PlaceResult, SearchPlacesResponse } from "@/types/PlacesTypes";

export const searchPlaces = async (
  searchText: string,
  initialLat: number,
  initialLng: number,
  apiKey: string,
  radius: number = 1000 // Default value of 1000
): Promise<SearchPlacesResponse> => {
  if (!searchText.trim()) return { results: [], coords: [] };

  // Enforce a minimum radius of 500
  const effectiveRadius = Math.max(radius, 500);

  // Enforce a maximum radius of 5000
  const finalRadius = Math.min(effectiveRadius, 10000);

  const controller = new AbortController();
  const signal = controller.signal;

  const location = `${initialLat},${initialLng}`;
  const encodedSearchText = encodeURIComponent(searchText);
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodedSearchText}&location=${location}&radius=${finalRadius}&type=point_of_interest&key=${apiKey}`;

  try {
    const response = await fetch(url, { signal });

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
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return { results: [], coords: [] }; // Return empty results on abort
      }

      if (error instanceof PlacesAPIError) {
        throw error; // Rethrow API-specific errors
      }
    }

    throw new PlacesAPIError("Failed to fetch places"); // Updated error message
  } finally {
    controller.abort(); // Ensure the request is aborted to prevent memory leaks
  }
};
