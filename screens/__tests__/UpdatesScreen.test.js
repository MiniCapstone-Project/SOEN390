import React from 'react';
import { render } from '@testing-library/react-native';
import UpdatesScreen from '../UpdatesScreen';

describe('UpdatesScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<UpdatesScreen />);
    expect(getByText('Updates Screen')).toBeTruthy();
  });

  // Add more tests as needed
});
