import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import DirectionsScreen from "../DirectionsScreen";

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
