import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { InputField } from '../InputComponents/InputFields';

describe('InputField Component', () => {
  it('renders correctly with placeholder', () => {
    const { getByPlaceholderText } = render(
      <InputField searchText="" onSearchTextChange={() => {}} onSearchPress={() => {}} onClearPress={() => {}} placeholder="Enter text" />
    );
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('updates text input value when typing', () => {
    const mockOnSearchTextChange = jest.fn();
    const { getByPlaceholderText } = render(
      <InputField searchText="" onSearchTextChange={mockOnSearchTextChange} onSearchPress={() => {}} onClearPress={() => {}} placeholder="Enter text" />
    );
    fireEvent.changeText(getByPlaceholderText('Enter text'), 'New Input');
    expect(mockOnSearchTextChange).toHaveBeenCalledWith('New Input');
  });

  it('calls onClearPress when clear button is pressed', () => {
    const mockOnClearPress = jest.fn();
    const { getByText } = render(
      <InputField searchText="Test" onSearchTextChange={() => {}} onSearchPress={() => {}} onClearPress={mockOnClearPress} placeholder="Enter text" />
    );
    fireEvent.press(getByText('X'));
    expect(mockOnClearPress).toHaveBeenCalledTimes(1);
  });
});
