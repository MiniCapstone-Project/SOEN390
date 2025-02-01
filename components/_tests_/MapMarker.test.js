import React from 'react';
import { render } from '@testing-library/react-native';
import MapMarker from '../Map/MapMarker';

// Mock react-native-maps
jest.mock('react-native-maps', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    Marker: ({ coordinate, title, ...props }) => (
      <View {...props} testID="map-marker" coordinate={coordinate} title={title} />
    ),
  };
});

describe('MapMarker Component', () => {
  it('renders correctly with provided coordinates', () => {
    const { getByTestId } = render(
      <MapMarker coordinate={{ latitude: 45.5017, longitude: -73.5673 }} title="Test Marker" />
    );
    expect(getByTestId('map-marker')).toBeTruthy();
  });

  it('displays the correct location', () => {
    const { getByTestId } = render(
      <MapMarker coordinate={{ latitude: 40.7128, longitude: -74.0060 }} title="New York" />
    );

    const marker = getByTestId('map-marker');

    // Ensure coordinate is correctly passed as an object
    expect(marker.props.coordinate.latitude).toBe(40.7128);
    expect(marker.props.coordinate.longitude).toBe(-74.0060);
  });
});
