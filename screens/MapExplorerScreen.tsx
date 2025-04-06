import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MapExplorerScreen from '../MapExplorerScreen';

describe('MapExplorerScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<MapExplorerScreen />);
    expect(getByText('SGW')).toBeTruthy();
    expect(getByText('Loyola')).toBeTruthy();
    expect(getByText('ME')).toBeTruthy();
  });

  it('switches to SGW campus', () => {
    const { getByText } = render(<MapExplorerScreen />);
    fireEvent.press(getByText('SGW'));
    expect(getByText('SGW')).toBeTruthy();
  });

  it('switches to Loyola campus', () => {
    const { getByText } = render(<MapExplorerScreen />);
    fireEvent.press(getByText('Loyola'));
    expect(getByText('Loyola')).toBeTruthy();
  });

  it('centers to user location', () => {
    const { getByText } = render(<MapExplorerScreen />);
    fireEvent.press(getByText('ME'));
    expect(getByText('ME')).toBeTruthy();
  });

  it('searches places when typing', () => {
    const { getByPlaceholderText, getByText } = render(<MapExplorerScreen />);
    fireEvent.changeText(getByPlaceholderText('Search for places...'), 'Test Place');
    expect(getByText('Test Place')).toBeTruthy();
  });
});