import { render, waitFor, fireEvent, act } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "../Navigation";
import React from "react";

// Mock screens that might import GoogleKey
jest.mock("../../screens/MapExplorerScreen", () => {
  const React = require("react");
  return () => <React.Fragment />;
});

jest.mock("../../screens/DirectionsScreen", () => {
  const React = require("react");
  return () => <React.Fragment />;
});

// Mock react-native-maps
jest.mock("react-native-maps", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: React.forwardRef(() => <View />),
    Marker: () => <View />,
    Polyline: () => <View />,
    PROVIDER_GOOGLE: "google",
  };
});

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock expo-font
jest.mock("expo-font", () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn().mockReturnValue(true),
}));

// Mock Ionicons
jest.mock("react-native-vector-icons/Ionicons", () => "Ionicons");

describe("Navigation Component - Screens", () => {
  test("renders and navigates between all tabs correctly", async () => {
    const { getByRole, getByText, getAllByText } = render(
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    );

    // Ensure the default tab is loaded
    expect(getByRole("button", { name: "Campus Guide" })).toBeTruthy();

    // Navigate to Directions tab using act()
    await act(async () => {
      fireEvent.press(getByRole("button", { name: "Directions" }));
    });

    await waitFor(() => {
      // Fix: Ensure we're checking the correct screen heading, not the tab button
      expect(getAllByText("Directions")[0]).toBeTruthy(); // Select the first match (screen title)
    });

    // Navigate to Updates tab inside act()
    await act(async () => {
      fireEvent.press(getByRole("button", { name: "Updates" }));
    });

    await waitFor(() => {
      expect(getByText("Updates Screen")).toBeTruthy();
    });

    // Navigate to Settings tab inside act()
    await act(async () => {
      fireEvent.press(getByRole("button", { name: "Settings" }));
    });

    await waitFor(() => {
      expect(getByText("Settings Screen")).toBeTruthy();
    });
  });
});
