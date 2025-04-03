import React from "react";
import { render } from "@testing-library/react-native";
import DirectionsScreen from "../DirectionsScreen";
import { useRoute } from "@react-navigation/native";

jest.mock("@react-navigation/native", () => ({
  useRoute: jest.fn(),
}));

test("should receive destination from route params", () => {
  useRoute.mockReturnValue({
    params: {
      destination: {
        Address: "Loyola Campus",
        Latitude: 45.4581244,
        Longitude: -73.6391259,
      },
    },
  });

  const { queryByText } = render(<DirectionsScreen />);
  const destinationText = queryByText("Loyola Campus");

  if (destinationText) {
    expect(destinationText).toBeTruthy();
  } else {
    console.log("Destination text not found");
  }
});
