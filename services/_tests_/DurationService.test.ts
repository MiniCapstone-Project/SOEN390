import { getTripDuration } from "@/services/DurationService";
import { LatLng } from "react-native-maps";

global.fetch = jest.fn();

describe("getTripDuration", () => {
  const origin: LatLng = { latitude: 45.5017, longitude: -73.5673 };
  const destination: LatLng = { latitude: 45.5088, longitude: -73.554 };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return the trip duration in minutes on successful fetch", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        status: "OK",
        rows: [
          {
            elements: [
              {
                status: "OK",
                duration: { value: 600 } // 10 minutes in seconds
              }
            ]
          }
        ]
      })
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const duration = await getTripDuration(origin, destination);
    expect(duration).toBe(10);
  });

  it("should throw an error if the API response status is not OK", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        status: "REQUEST_DENIED",
        error_message: "API key is invalid"
      })
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await expect(getTripDuration(origin, destination)).rejects.toThrow("API error API key is invalid");
  });

  it("should throw an error if the element status is not OK", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        status: "OK",
        rows: [
          {
            elements: [
              {
                status: "ZERO_RESULTS"
              }
            ]
          }
        ]
      })
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await expect(getTripDuration(origin, destination)).rejects.toThrow("API error undefined");
  });
});
