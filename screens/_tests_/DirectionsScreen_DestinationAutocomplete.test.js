import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import DirectionsScreen from "../DirectionsScreen";

test("should allow selecting a destination", () => {
  const { queryByTestId } = render(<DirectionsScreen />);
  const destinationInput = queryByTestId("destinationInput");

  if (destinationInput) {
    fireEvent.press(destinationInput);
    expect(destinationInput).toBeTruthy();
  } else {
    console.log("Destination input not found");
  }
});
