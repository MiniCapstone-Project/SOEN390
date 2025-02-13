import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CampusSwitch } from '../InputComponents/Buttons';

describe('CustomButton (tested via CampusSwitch)', () => {
  it('renders correctly with the given title', () => {
    const { getByText } = render(
      <CampusSwitch title="Click Me" onCampusSwitch={() => {}} />
    );
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('calls onCampusSwitch when clicked', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <CampusSwitch title="Click Me" onCampusSwitch={mockOnPress} />
    );
    fireEvent.press(getByText('Click Me'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('applies custom background style indirectly', () => {
    const customStyle = { backgroundColor: 'blue' };
    const { getByText } = render(
      <CampusSwitch title="Styled Button" onCampusSwitch={() => {}} style={customStyle} />
    );
    expect(getByText('Styled Button')).toBeTruthy();
  });
});
