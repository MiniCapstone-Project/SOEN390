import "../setupTests";

import { render, waitFor, fireEvent, act } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "../Navigation";
import React from "react";

describe("Navigation Component - Screens", () => {
  test("renders and navigates between all tabs correctly", async () => {
    const { getByRole, getByText, getAllByText } = render(
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    );

    // Ensure the default tab is loaded
    expect(getByRole("button", { name: "Campus Guide" })).toBeTruthy();

    // Navigate to Directions tab inside act()
    await act(async () => {
      fireEvent.press(getByRole("button", { name: "Directions" }));
    });

    await waitFor(() => {
      expect(getAllByText("Directions")[0]).toBeTruthy(); // Select only the first instance
    });

    // Navigate to Updates tab inside act()
    await act(async () => {
      fireEvent.press(getByRole("button", { name: "Updates" }));
    });

    await waitFor(() => {
      expect(getByText("Updates Screen")).toBeTruthy();
    });

    // Navigate to Settings tab inside act()
    await act(async () => {
      fireEvent.press(getByRole("button", { name: "Settings" }));
    });

    await waitFor(() => {
      expect(getByText("Settings Screen")).toBeTruthy();
    });
  });
});