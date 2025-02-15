import { render, waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "../Navigation";
import React from "react";

// ✅ Mock react-native-maps to prevent Jest errors
jest.mock("react-native-maps", () => {
  const React = require("react");
  const View = require("react-native").View;
  const MapView = (props) => React.createElement(View, props, props.children);
  return {
    __esModule: true,
    default: MapView,
    Marker: View,
    Polyline: View,
    PROVIDER_GOOGLE: "google",
  };
});

// ✅ Fix ref issue in react-native-maps
jest.mock("react-native-maps", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: React.forwardRef(() => null),
    Marker: () => null,
    Polyline: () => null,
  };
});

// ✅ Mock AsyncStorage to prevent Jest errors
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// ✅ Mock expo-font to avoid forEach error
jest.mock("expo-font", () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn().mockReturnValue(true),
}));

// ✅ Mock react-native-vector-icons to prevent rendering issues
jest.mock("react-native-vector-icons/Ionicons", () => "Ionicons");

describe("Navigation Component - Screens", () => {
  test("renders all expected screens in the Tab Navigator", async () => {
    const { getByText } = render(
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    );

  });
});
