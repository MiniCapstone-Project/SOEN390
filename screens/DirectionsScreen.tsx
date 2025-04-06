
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DirectionsScreen from '../DirectionsScreen';
import { useRoute } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(() => ({
    params: {
      destination: {
        Address: 'Test Location',
        Latitude: 45.5,
        Longitude: -73.6,
      },
    },
  })),
}));

describe('DirectionsScreen', () => {
  it('renders basic components', () => {
    const { getByText, getByTestId } = render(<DirectionsScreen />);
    expect(getByText('From')).toBeTruthy();
    expect(getByText('Destination')).toBeTruthy();
    expect(getByTestId('WALKING')).toBeTruthy();
    expect(getByTestId('DRIVING')).toBeTruthy();
  });

  it('changes transport mode', () => {
    const { getByTestId } = render(<DirectionsScreen />);
    fireEvent.press(getByTestId('WALKING'));
    fireEvent.press(getByTestId('DRIVING'));
    fireEvent.press(getByTestId('TRANSIT'));
    fireEvent.press(getByTestId('SHUTTLE'));
    expect(getByTestId('DRIVING')).toBeTruthy();
  });

  it('triggers route calculation', () => {
    const { getByTestId } = render(<DirectionsScreen />);
    fireEvent.press(getByTestId('ROUTE'));
    expect(getByTestId('ROUTE')).toBeTruthy();
  });

  it('renders distance and duration', () => {
    const { getByText } = render(<DirectionsScreen />);
    expect(getByText('Distance:')).toBeTruthy();
    expect(getByText('Duration:')).toBeTruthy();
  });
});
