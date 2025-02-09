import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CampusSwitch from '../InputComponents/Buttons';

describe('CampusSwitch Component', () => {
  it('renders correctly', () => {
    const mockOnCampusSwitch = jest.fn();

    const { getByText } = render(
      <CampusSwitch onCampusSwitch={mockOnCampusSwitch} title="Switch Campus" />
    );


    expect(getByText('Switch Campus')).toBeTruthy();
  });

  it('triggers the correct action when pressed', () => {
    const mockOnCampusSwitch = jest.fn();

    const { getByText } = render(
      <CampusSwitch onCampusSwitch={mockOnCampusSwitch} title="Switch Campus" />
    );

    fireEvent.press(getByText('Switch Campus'));
    expect(mockOnCampusSwitch).toHaveBeenCalledTimes(1);
  });
});
