import "../setupTests";

import { render, waitFor, fireEvent, act } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "../Navigation";
import React from "react";

describe("Navigation Component - Icons", () => {
  test("renders and navigates between tabs correctly", async () => {
    // Render should not be wrapped in `act(...)`
    const { getByRole, getByText, getAllByText } = render(
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    );

    // Ensure the default tab is loaded
    expect(getByRole("button", { name: "Campus Guide" })).toBeTruthy();

    // Use `await act(...)` for user interactions
    await act(async () => {
      fireEvent.press(getByRole("button", { name: "Directions" }));
    });

    await waitFor(() => {
      expect(getAllByText("Directions")[0]).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByRole("button", { name: "Updates" }));
    });

    await waitFor(() => {
      expect(getByText("Updates Screen")).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByRole("button", { name: "Settings" }));
    });

    await waitFor(() => {
      expect(getByText("Settings Screen")).toBeTruthy();
    });
  });
});
