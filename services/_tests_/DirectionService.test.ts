import { retrieveRoutes } from "@/services/DirectionService";
import { DirectionsAPIError } from "@/errors/DirectionApiError";

global.fetch = jest.fn();

describe("retrieveRoutes", () => {
  const originLat = 45.5017;
  const originLong = -73.5673;
  const destinationLat = 45.5088;
  const destinationLong = -73.554;
  const transportMode = "DRIVING";
  const apikey = "test-api-key";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return the shortest route on successful fetch", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        status: "OK",
        routes: [{ legs: [] }]
      })
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await retrieveRoutes(originLat, originLong, destinationLat, destinationLong, transportMode, apikey);
    expect(result).toEqual({ legs: [] });
  });

  it("should throw DirectionsAPIError on fetch failure", async () => {
    const mockResponse = {
      ok: false,
      status: 500
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await expect(retrieveRoutes(originLat, originLong, destinationLat, destinationLong, transportMode, apikey)).rejects.toThrow(DirectionsAPIError);
  });

  it("should handle fetch abort", async () => {
    const mockAbortError = new Error("AbortError");
    mockAbortError.name = "AbortError";
    (global.fetch as jest.Mock).mockRejectedValue(mockAbortError);

    const result = await retrieveRoutes(originLat, originLong, destinationLat, destinationLong, transportMode, apikey);
    expect(result).toBeNull();
  });

  it("should throw error if directions status is not OK", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        status: "ZERO_RESULTS",
        routes: []
      })
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await expect(retrieveRoutes(originLat, originLong, destinationLat, destinationLong, transportMode, apikey)).rejects.toThrow("Direction Fetch Failure with code ZERO_RESULTS");
  });
});
