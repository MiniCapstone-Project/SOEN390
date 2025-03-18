import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MarkerInfoBox from '@/components/MapComponents/MarkerInfoBox';

describe('MarkerInfoBox Component', () => {
  const mockTitle = 'Test Location';
  const mockAddress = '123 Test Street';
  const mockOnClose = jest.fn();
  const mockOnDirections = jest.fn();

  it('renders without crashing', () => {
    const { getByText } = render(
      <MarkerInfoBox
        title={mockTitle}
        address={mockAddress}
        onClose={mockOnClose}
        onDirections={mockOnDirections}
      />
    );
    expect(getByText('Test Location')).toBeTruthy();
  });

  it('displays the title and address correctly', () => {
    const { getByText } = render(
      <MarkerInfoBox
        title={mockTitle}
        address={mockAddress}
        onClose={mockOnClose}
        onDirections={mockOnDirections}
      />
    );
    expect(getByText(mockTitle)).toBeTruthy();
    expect(getByText(mockAddress)).toBeTruthy();
  });

  it('triggers onClose when the "Close" button is pressed', () => {
    const { getByText } = render(
      <MarkerInfoBox
        title={mockTitle}
        address={mockAddress}
        onClose={mockOnClose}
        onDirections={mockOnDirections}
      />
    );
    fireEvent.press(getByText('Close'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('triggers onDirections when the "Directions" button is pressed', () => {
    const { getByText } = render(
      <MarkerInfoBox
        title={mockTitle}
        address={mockAddress}
        onClose={mockOnClose}
        onDirections={mockOnDirections}
      />
    );
    fireEvent.press(getByText('Directions'));
    expect(mockOnDirections).toHaveBeenCalled();
  });
});
