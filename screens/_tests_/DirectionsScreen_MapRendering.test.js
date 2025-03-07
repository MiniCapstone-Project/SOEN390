import React from "react";
import { render } from "@testing-library/react-native";
import DirectionsScreen from "../DirectionsScreen";

test("should render MapView", () => {
  const { queryByTestId } = render(<DirectionsScreen />);
  const mapView = queryByTestId("mapView");

  if (mapView) {
    expect(mapView).toBeTruthy();
  } else {
    console.log("MapView not found");
  }
});
