import { render, waitFor, fireEvent, act } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "../Navigation";
import React from "react";

// Mock entire files that reference GoogleKey
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

describe("Navigation Component - Icons", () => {
  test("renders and navigates between tabs correctly", async () => {
    const { getAllByText, getByRole, getByText } = render(
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    );

    await act(async () => {
      fireEvent.press(getByRole("button", { name: "Directions" }));
    });

    await waitFor(() => {
      expect(getAllByText("Directions")[0]).toBeTruthy(); // Ensures correct selection
    });

    await act(async () => {
      fireEvent.press(getByRole("button", { name: "Updates" }));
    });

    await waitFor(() => {
      expect(getAllByText("Updates Screen")[0]).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByRole("button", { name: "Settings" }));
    });

    await waitFor(() => {
      expect(getAllByText("Settings Screen")[0]).toBeTruthy();
    });
  });
});
