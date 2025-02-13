/**
 * @jest-environment jsdom
 */
 import { rendimport { renderHook, act } from "@testing-library/react-hooks";
 import { useRequestLocationPermission } from "../RequestUserLocation";
             import { PermissionsAndroid, Platform } from "react-native";

             // ✅ Mock PermissionsAndroid and Platform
             jest.mock("react-native", () => ({
               PermissionsAndroid: {
                 request: jest.fn(),
                 PERMISSIONS: { ACCESS_FINE_LOCATION: "ACCESS_FINE_LOCATION" },
                 RESULTS: { GRANTED: "granted", DENIED: "denied" },
               },
               Platform: { OS: "android" },
             }));

             // ✅ Define global navigator properly
             global.navigator = {
               geolocation: {
                 getCurrentPosition: jest.fn(),
               },
             };

             describe("useRequestLocationPermission - Geolocation", () => {
               beforeEach(() => {
                 jest.clearAllMocks();
               });

               it("should handle geolocation errors", async () => {
                 PermissionsAndroid.request.mockResolvedValue("granted");

                 global.navigator.geolocation.getCurrentPosition.mockImplementationOnce((_, error) =>
                   error({ message: "Location unavailable" })
                 );

                 const mockConsoleError = jest.spyOn(console, "error").mockImplementation(() => {});

                 await act(async () => {
                   renderHook(() => useRequestLocationPermission());
                 });

                 expect(mockConsoleError).toHaveBeenCalledWith(
                   "Error getting location: ",
                   { message: "Location unavailable" }
                 );
               });
             });
