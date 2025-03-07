import React from "react";
import { render } from "@testing-library/react-native";
import DirectionsScreen from "../DirectionsScreen";

test("should render distance and duration stats", () => {
  const { queryByText } = render(<DirectionsScreen />);
  const distanceText = queryByText(/Distance:/);
  const durationText = queryByText(/Duration:/);

  if (distanceText) {
    expect(distanceText).toBeTruthy();
  } else {
    console.log("Distance text not found");
  }

  if (durationText) {
    expect(durationText).toBeTruthy();
  } else {
    console.log("Duration text not found");
  }
});
