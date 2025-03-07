import React from 'react';
import { render } from '@testing-library/react-native';
import MapMarker from '@/components/MapComponents/MapMarker';
import { Marker } from 'react-native-maps';

jest.mock('react-native-maps', () => {
  const React = require('react');
  return {
    Marker: ({ children, ...props }) =>
      React.createElement('Marker', { ...props, testID: 'marker' }, children),
  };
});

describe('MapMarker Component', () => {
  const mockCoordinate = { latitude: 37.78825, longitude: -122.4324 };
  const mockTitle = 'Test Location';

  it('renders without crashing', () => {
    const { getByTestId } = render(
      <MapMarker coordinate={mockCoordinate} title={mockTitle} />
    );
    expect(getByTestId('marker')).toBeTruthy();
  });

  it('displays the title correctly', () => {
    const { getByTestId } = render(
      <MapMarker coordinate={mockCoordinate} title={mockTitle} />
    );
    expect(getByTestId('marker').props.title).toBe(mockTitle);
  });

  it('receives the correct coordinate props', () => {
    const { getByTestId } = render(
      <MapMarker coordinate={mockCoordinate} title={mockTitle} />
    );
    expect(getByTestId('marker').props.coordinate).toEqual(mockCoordinate);
  });

  it('uses Marker component from react-native-maps', () => {
    const { getByTestId } = render(
      <MapMarker coordinate={mockCoordinate} title={mockTitle} />
    );
    expect(getByTestId('marker')).toBeTruthy();
  });
});
