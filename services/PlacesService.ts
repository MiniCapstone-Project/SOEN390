import { PlacesAPIError } from "@/errors/PlacesAPIError";
import { LatLng } from "react-native-maps";
import { PlaceResult, SearchPlacesResponse } from "@/types/PlacesTypes";

export const searchPlaces = async (
  searchText: string,
  initialLat: number,
  initialLng: number,
  apiKey: string,
  radius: number = 1000 // Default value of 1000
): Promise<any> => { // Change return type to any to accommodate GeoJSON
  if (!searchText.trim()) return { type: "FeatureCollection", features: [] };

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
      return { type: "FeatureCollection", features: [] }; // No POIs found
    }

    const features = json.results.map((item: any) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [item.geometry.location.lng, item.geometry.location.lat],
      },
      properties: {
        name: item.name,
        formatted_address: item.formatted_address,
        place_id: item.place_id,
      },
    }));

    return { type: "FeatureCollection", features };
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return { type: "FeatureCollection", features: [] }; // Return empty results on abort
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
