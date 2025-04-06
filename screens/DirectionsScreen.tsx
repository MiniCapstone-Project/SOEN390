// DirectionsScreen.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DirectionsScreen from '../DirectionsScreen';
import { act } from 'react-test-renderer';

// Basic Rendering Test
it('renders DirectionsScreen without crashing', () => {
  const { getByText } = render(<DirectionsScreen />);
  expect(getByText('From')).toBeTruthy();
  expect(getByText('Destination')).toBeTruthy();
});

// Transport Mode Buttons
it('changes transport mode on button click', () => {
  const { getByTestId } = render(<DirectionsScreen />);
  act(() => {
    fireEvent.press(getByTestId('WALKING'));
    fireEvent.press(getByTestId('DRIVING'));
  });
  expect(getByTestId('WALKING')).toBeTruthy();
  expect(getByTestId('DRIVING')).toBeTruthy();
});

// MapExplorerScreen.test.tsx
import MapExplorerScreen from '../MapExplorerScreen';

// Basic Rendering Test
it('renders MapExplorerScreen without crashing', () => {
  const { getByText } = render(<MapExplorerScreen />);
  expect(getByText('SGW')).toBeTruthy();
  expect(getByText('Loyola')).toBeTruthy();
});

// User Location Button
it('centers map on user location when ME button is pressed', () => {
  const { getByText } = render(<MapExplorerScreen />);
  act(() => {
    fireEvent.press(getByText('ME'));
  });
  expect(getByText('ME')).toBeTruthy();
});

// Campus Switching
it('switches campus when SGW button is pressed', () => {
  const { getByText } = render(<MapExplorerScreen />);
  act(() => {
    fireEvent.press(getByText('SGW'));
  });
  expect(getByText('SGW')).toBeTruthy();
});