jest.mock("../../screens/DirectionsScreen", () => {
  const React = require("react");
  return () => <React.Fragment />;
});

import { render, waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "../Navigation";
import React from "react";

// 1️⃣ Mock the file referencing @/constants/GoogleKey
jest.mock("../../screens/MapExplorerScreen", () => {
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

// Mock react-native-vector-icons
jest.mock("react-native-vector-icons/Ionicons", () => "Ionicons");

describe("Navigation Component - Icons", () => {
  test("renders without using a real API key", async () => {
    const { getByText } = render(
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    );
  });
});
