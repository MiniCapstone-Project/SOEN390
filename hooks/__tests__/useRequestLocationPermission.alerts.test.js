import { renderHook, act } from "@testing-library/react-hooks";
import { useRequestLocationPermission } from "../RequestUserLocation";
import { PermissionsAndroid, Alert, Platform } from "react-native";

jest.mock("react-native", () => ({
  PermissionsAndroid: {
    request: jest.fn(),
    PERMISSIONS: { ACCESS_FINE_LOCATION: "ACCESS_FINE_LOCATION" },
    RESULTS: { GRANTED: "granted", DENIED: "denied" },
  },
  Alert: { alert: jest.fn() },
  Platform: { OS: "android" },
}));

describe("useRequestLocationPermission - Alerts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should show an alert when permission is denied", async () => {
    PermissionsAndroid.request.mockResolvedValue("denied");

    await act(async () => {
      renderHook(() => useRequestLocationPermission());
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "Permission Denied",
      "GIVE ME YOUR LOCATION!!!!"
    );
  });
});
