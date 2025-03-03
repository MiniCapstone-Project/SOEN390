import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { CustomMarkersComponent } from "../MarkersComponent";
import { Marker } from "react-native-maps";

jest.mock("react-native-maps", () => {
  const React = require("react");
  return {
    Marker: ({ children, ...props }) =>
      React.createElement("View", { ...props, testID: "marker" }, children),
  };
});

const mockData = [
  { id: 1, Latitude: 45.5017, Longitude: -73.5673, BuildingName: "Building A" },
  { id: 2, Latitude: 45.5027, Longitude: -73.5683, name: "Building B" },
  { id: 3, geometry: { location: { lat: 45.5037, lng: -73.5693 } }, name: "Building C" },
];

describe("CustomMarkersComponent", () => {
  it("renders markers correctly", () => {
    const { getAllByTestId } = render(
      <CustomMarkersComponent data={mockData} handleMarkerPress={jest.fn()} />
    );

    const markers = getAllByTestId("marker");
    expect(markers).toHaveLength(3);
  });

  it("handles marker press", () => {
    const handleMarkerPress = jest.fn();
    const { getAllByTestId } = render(
      <CustomMarkersComponent data={mockData} handleMarkerPress={handleMarkerPress} />
    );

    const markers = getAllByTestId("marker");
    fireEvent.press(markers[0]);
    expect(handleMarkerPress).toHaveBeenCalledWith(mockData[0]);
  });

  it("does not render markers with undefined coordinates", () => {
    const dataWithUndefinedCoords = [
      ...mockData,
      { id: 4, Latitude: undefined, Longitude: undefined, name: "Building D" },
    ];
    const { getAllByTestId } = render(
      <CustomMarkersComponent data={dataWithUndefinedCoords} handleMarkerPress={jest.fn()} />
    );

    const markers = getAllByTestId("marker");
    expect(markers).toHaveLength(3);
  });
});
