import "../setupTests";
import { render, waitFor, fireEvent, act } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "../Navigation";
import React from "react";
import { AND_CLIENT_ID } from '@/constants/GoogleKey';
console.log("GoogleKey used in test:", AND_CLIENT_ID);

describe("Navigation Component", () => {
  let renderResult, getByRole, getByText, getAllByText;

  beforeEach(async () => {

    await waitFor(() => {
      renderResult = render(
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      );
      getByRole = renderResult.getByRole;
      getByText = renderResult.getByText;
      getAllByText = renderResult.getAllByText;
    });
  });

  test("renders and navigates between tabs correctly", async () => {
    await waitFor(() => {
      expect(renderResult).toBeTruthy();
    });

    await act(async () => {
      expect(getByRole("button", { name: "Map" })).toBeTruthy();
    });

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
      expect(getByText(/get location/i)).toBeTruthy();
    });
  });
});
