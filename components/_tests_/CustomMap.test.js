import React from 'react';
import { render } from '@testing-library/react-native';
import CustomMap from '../Map/CustomMap';


jest.mock('react-native-maps', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props) => <View {...props} testID="custom-map" />,
    Marker: ({ coordinate, title, ...props }) => (
      <View {...props} testID="map-marker" coordinate={coordinate} title={title} />
    ),
  };
});

describe('CustomMap Component', () => {
  const defaultRegion = {
    latitude: 45.5017,
    longitude: -73.5673,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const defaultMarkers = [
    { latitude: 40.7128, longitude: -74.0060, title: 'Marker 1' },
    { latitude: 34.0522, longitude: -118.2437, title: 'Marker 2' },
  ];

  it('renders without crashing', () => {
    const { getByTestId } = render(<CustomMap initialRegion={defaultRegion} markers={[]} />);
    expect(getByTestId('custom-map')).toBeTruthy();
  });

  it('initializes at the correct location', () => {
    const { getByTestId } = render(<CustomMap initialRegion={defaultRegion} markers={[]} />);
    expect(getByTestId('custom-map').props.initialRegion).toEqual(defaultRegion);
  });

  it('renders markers correctly', () => {
    const { getAllByTestId } = render(<CustomMap initialRegion={defaultRegion} markers={defaultMarkers} />);

    const renderedMarkers = getAllByTestId('map-marker');
    expect(renderedMarkers.length).toBe(2);

    expect(renderedMarkers[0].props.coordinate.latitude).toBe(40.7128);
    expect(renderedMarkers[0].props.coordinate.longitude).toBe(-74.0060);
    expect(renderedMarkers[1].props.coordinate.latitude).toBe(34.0522);
    expect(renderedMarkers[1].props.coordinate.longitude).toBe(-118.2437);
  });
});
