import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import SettingsScreen from "../SettingsScreen";
import * as Location from "expo-location";

// ✅ Mock `expo-location` to control location permission requests
jest.mock("expo-location", () => ({
    requestForegroundPermissionsAsync: jest.fn(),
    getCurrentPositionAsync: jest.fn(),
}));

describe("SettingsScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders Settings Screen correctly", () => {
        render(<SettingsScreen />);

        expect(screen.getByText("Settings Screen")).toBeTruthy();
        expect(screen.getByText("Get Location")).toBeTruthy();
    });

    test("calls location permission request when button is pressed", async () => {
        Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: "granted" });

        render(<SettingsScreen />);

        const locationButton = screen.getByText("Get Location");
        fireEvent.press(locationButton);

        expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalledTimes(1);
    });
});
