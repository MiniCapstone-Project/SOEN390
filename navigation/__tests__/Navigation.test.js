import "../setupTests";
import { render, waitFor, fireEvent, act } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "../Navigation";
import React from "react";

describe("Navigation Component", () => {
  let getByRole, getByText, getAllByText;

  beforeEach(() => {
    const renderResult = render(
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    );
    getByRole = renderResult.getByRole;
    getByText = renderResult.getByText;
    getAllByText = renderResult.getAllByText;
  });

  test("renders and navigates between tabs correctly", async () => {
    // Update the test to look for the correct tab names
    expect(getByRole("button", { name: "Map" })).toBeTruthy();

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
