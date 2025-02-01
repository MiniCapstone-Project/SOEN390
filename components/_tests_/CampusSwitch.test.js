import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CampusSwitch from '../CampusSwitch';

// Mock Native Modules that cause issues
jest.mock('react-native/Libraries/Settings/NativeSettingsManager', () => ({
  settings: {},
  setValues: jest.fn(),
}));

jest.mock('react-native/Libraries/Components/Touchable/TouchableOpacity', () => {
  const { View } = require('react-native');
  return (props) => <View {...props} />;
});

describe('CampusSwitch Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <CampusSwitch onSwitchToSGW={() => {}} onSwitchToLoyola={() => {}} />
    );

    // Check that both buttons are rendered
    expect(getByText('Switch to SGW')).toBeTruthy();
    expect(getByText('Switch to Loyola')).toBeTruthy();
  });

  it('triggers the correct action when "Switch to SGW" is pressed', () => {
    const mockOnSwitchToSGW = jest.fn();
    const { getByText } = render(
      <CampusSwitch onSwitchToSGW={mockOnSwitchToSGW} onSwitchToLoyola={() => {}} />
    );

    // Simulate button press
    fireEvent.press(getByText('Switch to SGW'));

    // Verify the mock function was called
    expect(mockOnSwitchToSGW).toHaveBeenCalledTimes(1);
  });

  it('triggers the correct action when "Switch to Loyola" is pressed', () => {
    const mockOnSwitchToLoyola = jest.fn();
    const { getByText } = render(
      <CampusSwitch onSwitchToSGW={() => {}} onSwitchToLoyola={mockOnSwitchToLoyola} />
    );

    // Simulate button press
    fireEvent.press(getByText('Switch to Loyola'));

    // Verify the mock function was called
    expect(mockOnSwitchToLoyola).toHaveBeenCalledTimes(1);
  });
});
