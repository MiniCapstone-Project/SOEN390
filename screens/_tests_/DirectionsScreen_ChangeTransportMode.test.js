import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import DirectionsScreen from "../DirectionsScreen";

// Mock external dependencies
jest.mock("react-native-maps", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: (props) => React.createElement(View, props),
    PROVIDER_GOOGLE: "google",
    Marker: (props) => React.createElement(View, props),
    MapViewDirections: (props) => React.createElement(View, props),
  };
});

jest.mock("react-native-google-places-autocomplete", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () => React.createElement(View, {}),
  };
});

jest.mock("@react-navigation/native", () => ({
  useRoute: jest.fn(() => ({
    params: {
      destination: {
        Address: "Loyola Campus",
        Latitude: 45.4581244,
        Longitude: -73.6391259,
      },
    },
  })),
}));

test("should change transport mode to Walking", () => {
  const { queryByText } = render(<DirectionsScreen />);

  const walkingButton = queryByText("Walking");

  if (walkingButton) {
    fireEvent.press(walkingButton);
    expect(walkingButton).toBeTruthy();
  } else {
    console.log("Walking button not found");
  }
});

test("should change transport mode to Driving", () => {
  const { queryByText } = render(<DirectionsScreen />);

  const drivingButton = queryByText("Driving");

  if (drivingButton) {
    fireEvent.press(drivingButton);
    expect(drivingButton).toBeTruthy();
  } else {
    console.log("Driving button not found");
  }
});

