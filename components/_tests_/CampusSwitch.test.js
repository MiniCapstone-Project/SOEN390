import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CampusSwitch from '../InputComponents/Buttons';

describe('CampusSwitch Component', () => {
  it('renders correctly with given title', () => {
    const { getByText } = render(
      <CampusSwitch onCampusSwitch={() => {}} title="Campus Switch" style={{}} />
    );
    expect(getByText('Campus Switch')).toBeTruthy();
  });

  it('calls onCampusSwitch when pressed', () => {
    const mockOnCampusSwitch = jest.fn();
    const { getByText } = render(
      <CampusSwitch onCampusSwitch={mockOnCampusSwitch} title="Campus Switch" style={{}} />
    );
    fireEvent.press(getByText('Campus Switch'));
    expect(mockOnCampusSwitch).toHaveBeenCalledTimes(1);
  });

  it('renders with a custom style when provided', () => {
    const { getByText } = render(
      <CampusSwitch
        onCampusSwitch={() => {}}
        title="Styled Campus Switch"
        style={{ padding: 10, backgroundColor: 'green' }}
      />
    );
    expect(getByText('Styled Campus Switch')).toBeTruthy();
  });

  it('updates text when prop changes', () => {
    const { getByText, rerender } = render(
      <CampusSwitch onCampusSwitch={() => {}} title="Old Title" style={{}} />
    );
    expect(getByText('Old Title')).toBeTruthy();

    rerender(
      <CampusSwitch onCampusSwitch={() => {}} title="New Title" style={{}} />
    );
    expect(getByText('New Title')).toBeTruthy();
  });
});
