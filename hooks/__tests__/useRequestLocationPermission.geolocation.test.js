import { renderHook, act } from "@testing-library/react-hooks";
import { useRequestLocationPermission } from "../RequestUserLocation";
import { PermissionsAndroid, Platform, Alert } from "react-native";

jest.mock("react-native", () => ({
  PermissionsAndroid: {
    request: jest.fn(),
    PERMISSIONS: { ACCESS_FINE_LOCATION: "ACCESS_FINE_LOCATION" },
    RESULTS: { GRANTED: "granted", DENIED: "denied" },
  },
  Platform: { OS: "android" },
  Alert: { alert: jest.fn() },
}));

beforeAll(() => {
  global.navigator = {
    geolocation: {
      getCurrentPosition: jest.fn((success, error) =>
        error({ message: "Location unavailable" })
      ),
      watchPosition: jest.fn(),
      clearWatch: jest.fn(),
    },
  };
});

describe("useRequestLocationPermission - Geolocation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle geolocation errors", async () => {
    PermissionsAndroid.request.mockResolvedValue("granted");

    const mockConsoleError = jest.spyOn(console, "error").mockImplementation(() => {});

    await act(async () => {
      renderHook(() => useRequestLocationPermission());
    });

    expect(mockConsoleError).toHaveBeenCalledWith(
      "Error getting location: ",
      { message: "Location unavailable" }
    );

    expect(Alert.alert).toHaveBeenCalledWith("Error", "Unable to retrieve location.");
  });
});
