/**
 * @jest-environment jsdom
 */
 import { renderHook, act } from "@testing-library/react-hooks";
import { useRequestLocationPermission } from "../RequestUserLocation";
import { PermissionsAndroid, Platform } from "react-native";

// ✅ Mock only PermissionsAndroid and Platform
jest.mock("react-native", () => ({
  PermissionsAndroid: {
    request: jest.fn(),
    PERMISSIONS: { ACCESS_FINE_LOCATION: "ACCESS_FINE_LOCATION" },
    RESULTS: { GRANTED: "granted", DENIED: "denied" },
  },
  Platform: { OS: "android" },
}));

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
