import { getTripDuration } from "../DurationService";
import { LatLng } from "react-native-maps";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      status: "OK",
      rows: [
        {
          elements: [
            {
              status: "OK",
              duration: {
                value: 3600 // 1 hour in seconds
              }
            }
          ]
        }
      ]
    })
  })
) as jest.Mock;

describe("getTripDuration", () => {
  it("should return the trip duration in minutes", async () => {
    const origin: LatLng = { latitude: 40.712776, longitude: -74.005974 };
    const destination: LatLng = { latitude: 34.052235, longitude: -118.243683 };

    const duration = await getTripDuration(origin, destination);
    expect(duration).toBe(60); // 3600 seconds is 60 minutes
  });

  it("should throw an error if the API response is invalid", async () => {
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          status: "INVALID_REQUEST",
          error_message: "Invalid request"
        })
      })
    );

    const origin: LatLng = { latitude: 40.712776, longitude: -74.005974 };
    const destination: LatLng = { latitude: 34.052235, longitude: -118.243683 };

    await expect(getTripDuration(origin, destination)).rejects.toThrow("API error Invalid request");
  });
});
