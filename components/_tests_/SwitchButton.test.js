import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SwitchButtons from '../Map/SwitchButton'; // Make sure the import path is correct

describe('SwitchButtons Component', () => {
  it('renders correctly with both buttons', () => {
    const { getByText } = render(<SwitchButtons onSwitchToSGW={() => {}} onSwitchToLoyola={() => {}} />);

    expect(getByText('Switch to SGW')).toBeTruthy();
    expect(getByText('Switch to Loyola')).toBeTruthy();
  });

  it('calls onSwitchToSGW when "Switch to SGW" is pressed', () => {
    const mockOnSwitchToSGW = jest.fn();
    const { getByText } = render(<SwitchButtons onSwitchToSGW={mockOnSwitchToSGW} onSwitchToLoyola={() => {}} />);

    fireEvent.press(getByText('Switch to SGW'));
    expect(mockOnSwitchToSGW).toHaveBeenCalledTimes(1);
  });

  it('calls onSwitchToLoyola when "Switch to Loyola" is pressed', () => {
    const mockOnSwitchToLoyola = jest.fn();
    const { getByText } = render(<SwitchButtons onSwitchToSGW={() => {}} onSwitchToLoyola={mockOnSwitchToLoyola} />);

    fireEvent.press(getByText('Switch to Loyola'));
    expect(mockOnSwitchToLoyola).toHaveBeenCalledTimes(1);
  });
});


