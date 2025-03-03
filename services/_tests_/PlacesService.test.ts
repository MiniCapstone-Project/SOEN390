import { searchPlaces } from "@/services/PlacesService";
import { PlacesAPIError } from "@/errors/PlacesAPIError";

global.fetch = jest.fn();

describe("searchPlaces", () => {
  const apiKey = "test-api-key";
  const initialLat = 45.5017;
  const initialLng = -73.5673;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return empty results if searchText is empty", async () => {
    const result = await searchPlaces("", initialLat, initialLng, apiKey);
    expect(result).toEqual({ results: [], coords: [] });
  });

  it("should fetch places and return results", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        results: [
          {
            name: "Place 1",
            geometry: { location: { lat: 45.5017, lng: -73.5673 } },
            formatted_address: "Address 1",
            place_id: "1"
          }
        ],
        status: "OK"
      })
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await searchPlaces("test", initialLat, initialLng, apiKey);
    expect(result.results).toHaveLength(1);
    expect(result.coords).toHaveLength(1);
  });

  it("should throw PlacesAPIError on fetch failure", async () => {
    const mockResponse = {
      ok: false,
      status: 500
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await expect(searchPlaces("test", initialLat, initialLng, apiKey)).rejects.toThrow(PlacesAPIError);
  });

  it("should handle fetch abort", async () => {
    const mockAbortError = new Error("AbortError");
    mockAbortError.name = "AbortError";
    (global.fetch as jest.Mock).mockRejectedValue(mockAbortError);

    const result = await searchPlaces("test", initialLat, initialLng, apiKey);
    expect(result).toEqual({ results: [], coords: [] });
  });
});
