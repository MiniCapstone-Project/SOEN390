import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CampusSwitch from '@/components/InputComponents/Buttons';

describe('CampusSwitch Component', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <CampusSwitch title="Test Campus" onCampusSwitch={jest.fn()} />
    );
    expect(getByText('Test Campus')).toBeTruthy();
  });

  it('displays the title correctly', () => {
    const { getByText } = render(
      <CampusSwitch title="Switch Campus" onCampusSwitch={jest.fn()} />
    );
    expect(getByText('Switch Campus')).toBeTruthy();
  });

  it('triggers onCampusSwitch when pressed', () => {
    const mockOnCampusSwitch = jest.fn();
    const { getByText } = render(
      <CampusSwitch title="Switch Campus" onCampusSwitch={mockOnCampusSwitch} />
    );
    fireEvent.press(getByText('Switch Campus'));
    expect(mockOnCampusSwitch).toHaveBeenCalled();
  });
});

describe('CustomButton Component', () => {
  it('renders with default style', () => {
    const { getByText } = render(
      <CampusSwitch title="Default Button" onCampusSwitch={jest.fn()} />
    );
    expect(getByText('Default Button')).toBeTruthy();
  });

  it('renders with custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    const customTextStyle = { color: 'white' };

    const { getByText } = render(
      <CampusSwitch
        title="Styled Button"
        onCampusSwitch={jest.fn()}
        style={customStyle}
        textStyle={customTextStyle}
      />
    );
    const buttonText = getByText('Styled Button');
    expect(buttonText).toBeTruthy();
  });

  it('triggers onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <CampusSwitch title="Press Me" onCampusSwitch={mockOnPress} />
    );
    fireEvent.press(getByText('Press Me'));
    expect(mockOnPress).toHaveBeenCalled();
  });
});
