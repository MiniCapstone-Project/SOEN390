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

// Mock AsyncStorage to prevent Jest errors
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock expo-font to avoid forEach error
jest.mock("expo-font", () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn().mockReturnValue(true),
}));

// Mock react-native-vector-icons
jest.mock("react-native-vector-icons/Ionicons", () => "Ionicons");

describe("Navigation Component - Render", () => {
  test("renders and navigates between tabs correctly", async () => {
    const { getAllByText, getByRole, getByText } = render(
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    );

    // Ensure default tab (Campus Guide) is rendered
    expect(getByRole("button", { name: "Campus Guide" })).toBeTruthy();

    // Navigate to Directions tab
    await act(async () => {
      fireEvent.press(getByRole("button", { name: "Directions" }));
    });

    await waitFor(() => {
      expect(getAllByText("Directions")[0]).toBeTruthy(); // Fix: Select the first occurrence
    });

    // Navigate to Updates tab
    await act(async () => {
      fireEvent.press(getByRole("button", { name: "Updates" }));
    });

    await waitFor(() => {
      expect(getByText("Updates Screen")).toBeTruthy();
    });

    // Navigate to Settings tab
    await act(async () => {
      fireEvent.press(getByRole("button", { name: "Settings" }));
    });

    await waitFor(() => {
      expect(getByText("Settings Screen")).toBeTruthy();
    });
  });
});
