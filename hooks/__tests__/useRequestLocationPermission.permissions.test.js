import { renderHook, act } from "@testing-library/react-hooks";
import { useRequestLocationPermission } from "../RequestUserLocation";
import { PermissionsAndroid, Platform } from "react-native";

jest.mock("react-native", () => ({
  PermissionsAndroid: {
    request: jest.fn(),
    PERMISSIONS: { ACCESS_FINE_LOCATION: "ACCESS_FINE_LOCATION" },
    RESULTS: { GRANTED: "granted", DENIED: "denied" },
  },
  Platform: { OS: "android" },
}));

beforeAll(() => {
  global.navigator = {
    geolocation: {
      getCurrentPosition: jest.fn(),
      watchPosition: jest.fn(),
      clearWatch: jest.fn(),
    },
  };
});

describe("useRequestLocationPermission - Permissions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should request location permission on mount", async () => {
    PermissionsAndroid.request.mockResolvedValue("granted");

    await act(async () => {
      renderHook(() => useRequestLocationPermission());
    });

    expect(PermissionsAndroid.request).toHaveBeenCalledWith(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      expect.any(Object)
    );
  });
});
