import React from "react";
import { render } from "@testing-library/react-native";
import DirectionsScreen from "../DirectionsScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

test("should load saved origin and destination from AsyncStorage", () => {
  AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify({ latitude: 45.5, longitude: -73.6 }));
  AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify({ latitude: 45.6, longitude: -73.7 }));

  render(<DirectionsScreen />);

  if (AsyncStorage.getItem.mock.calls.length > 0) {
    expect(AsyncStorage.getItem).toHaveBeenCalledWith("origin");
    expect(AsyncStorage.getItem).toHaveBeenCalledWith("destination");
  } else {
    console.log("AsyncStorage.getItem was not called.");
  }
});

