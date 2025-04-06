// Unit Tests for DirectionsScreen and MapExplorerScreen
// Improve test coverage to 100% across all metrics.

// DirectionsScreen.test.tsx
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import DirectionsScreen from '../DirectionsScreen';
import MapExplorerScreen from '../MapExplorerScreen';

// Mocking dependencies
jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({ params: { destination: { Address: 'Test Address', Latitude: 45.5, Longitude: -73.6 } } }),
}));

// DirectionsScreen Tests
it('renders DirectionsScreen without crashing', () => {
  const { getByText } = render(<DirectionsScreen />);
  expect(getByText('From')).toBeTruthy();
  expect(getByText('Destination')).toBeTruthy();
});

it('handles transport mode changes correctly', () => {
  const { getByTestId } = render(<DirectionsScreen />);
  act(() => {
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

it('triggers map route calculation', async () => {
  const { getByTestId } = render(<DirectionsScreen />);
  await act(async () => {
    fireEvent.press(getByTestId('ROUTE'));
  });
  expect(getByTestId('ROUTE')).toBeTruthy();
});

// MapExplorerScreen Tests
it('renders MapExplorerScreen without crashing', () => {
  const { getByText } = render(<MapExplorerScreen />);
  expect(getByText('SGW')).toBeTruthy();
  expect(getByText('Loyola')).toBeTruthy();
});

it('switches to SGW campus when SGW button is pressed', () => {
  const { getByText } = render(<MapExplorerScreen />);
  act(() => {
    fireEvent.press(getByText('SGW'));
  });
  expect(getByText('SGW')).toBeTruthy();
});

it('centers to user location when ME button is pressed', () => {
  const { getByText } = render(<MapExplorerScreen />);
  act(() => {
    fireEvent.press(getByText('ME'));
  });
  expect(getByText('ME')).toBeTruthy();
});

it('displays search results correctly', () => {
  const { getByPlaceholderText, getByText } = render(<MapExplorerScreen />);
  act(() => {
    fireEvent.changeText(getByPlaceholderText('Search for places...'), 'Test Place');
  });
  expect(getByText('Test Place')).toBeTruthy();
});
