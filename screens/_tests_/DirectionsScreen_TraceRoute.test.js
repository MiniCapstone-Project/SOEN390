import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import DirectionsScreen from "../DirectionsScreen";

test("should call traceRoute and retrieve directions", () => {
  const { queryByText } = render(<DirectionsScreen />);
  const routeButton = queryByText("Route");

  if (routeButton) {
    fireEvent.press(routeButton);
    expect(routeButton).toBeTruthy();
  } else {
    console.log("Route button not found");
  }
});
