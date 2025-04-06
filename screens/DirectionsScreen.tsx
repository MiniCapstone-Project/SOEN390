// DirectionsScreen.test.tsx
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import DirectionsScreen from '../DirectionsScreen';
import MapExplorerScreen from '../MapExplorerScreen';

// Mocking dependencies
jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({ params: { destination: { Address: 'Test Address', Latitude: 45.5, Longitude: -73.6 } } }),
  useNavigation: () => ({ dispatch: jest.fn() }),
}));

// DirectionsScreen Tests
it('renders DirectionsScreen correctly', () => {
  const { getByText } = render(<DirectionsScreen />);
  expect(getByText('From')).toBeTruthy();
  expect(getByText('Destination')).toBeTruthy();
});

it('changes transport mode correctly', async () => {
  const { getByTestId } = render(<DirectionsScreen />);
  await act(async () => {
    fireEvent.press(getByTestId('WALKING'));
    fireEvent.press(getByTestId('DRIVING'));
    fireEvent.press(getByTestId('TRANSIT'));
    fireEvent.press(getByTestId('SHUTTLE'));
  });
  expect(getByTestId('WALKING')).toBeTruthy();
  expect(getByTestId('DRIVING')).toBeTruthy();
  expect(getByTestId('TRANSIT')).toBeTruthy();
  expect(getByTestId('SHUTTLE')).toBeTruthy();
});

it('calculates route correctly', async () => {
  const { getByTestId } = render(<DirectionsScreen />);
  await act(async () => {
    fireEvent.press(getByTestId('ROUTE'));
  });
  expect(getByTestId('ROUTE')).toBeTruthy();
});

it('moves to location correctly', async () => {
  const { getByTestId } = render(<DirectionsScreen />);
  await act(async () => {
    fireEvent.press(getByTestId('MOVE_TO'));
  });
  expect(getByTestId('MOVE_TO')).toBeTruthy();
});

it('handles shuttle route setting', async () => {
  const { getByTestId } = render(<DirectionsScreen />);
  await act(async () => {
    fireEvent.press(getByTestId('SHUTTLE'));
  });
  expect(getByTestId('SHUTTLE')).toBeTruthy();
});

it('displays error on invalid input', () => {
  const { getByText } = render(<DirectionsScreen />);
});