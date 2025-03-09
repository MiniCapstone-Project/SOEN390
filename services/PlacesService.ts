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
  
  // Check if the search is for a generic POI type
  const genericPoiTypes = ['coffee', 'cafe', 'restaurant', 'food', 'shop', 'store', 'bar'];
  const isGenericPoiSearch = genericPoiTypes.some(type => searchText.toLowerCase().includes(type));
  
  // If generic POI search, use the 'type' parameter instead of just query
  let url;
  if (isGenericPoiSearch) {
    // Extract potential type from search text
    let poiType = 'restaurant'; // Default type
    for (const type of genericPoiTypes) {
      if (searchText.toLowerCase().includes(type)) {
        poiType = type === 'coffee' ? 'cafe' : type;
        break;
      }
    }
    url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${finalRadius}&type=${poiType}&key=${apiKey}`;
  } else {
    url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodedSearchText}&location=${location}&radius=${finalRadius}&type=point_of_interest&key=${apiKey}`;
  }

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

    const features = json.results.map((item: any) => {
      // Handle differences between textsearch and nearbysearch responses
      let lat, lng;
      
      if (item.geometry && item.geometry.location) {
        lat = item.geometry.location.lat;
        lng = item.geometry.location.lng;
      } else if (item.latitude && item.longitude) {
        lat = item.latitude;
        lng = item.longitude;
      } else {
        console.error("Invalid location data in place result:", item);
        return null; // Skip invalid results
      }
      
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
        properties: {
          name: item.name,
          formatted_address: item.formatted_address || item.vicinity || "No address available",
          place_id: item.place_id,
          types: item.types || [],
          rating: item.rating || 0,
          price_level: item.price_level || 0,
          // Add coordinate format needed by the directions handler
          coordinate: {
            latitude: lat,
            longitude: lng,
          },
          // For compatibility with building data format
          Address: item.formatted_address || item.vicinity || "No address available",
          Building_Long_Name: item.name
        },
      };
    }).filter((feature: any) => feature !== null);

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
