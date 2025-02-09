import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SearchBar } from '../InputComponents/InputFields';

describe('SearchBar Component', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText } = render(
      <SearchBar searchText="" onSearchTextChange={() => {}} onSearchPress={() => {}} onClearPress={() => {}} />
    );
    expect(getByPlaceholderText('Search place')).toBeTruthy();
  });

  it('calls onSearchTextChange when text is entered', () => {
    const mockOnSearchTextChange = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar searchText="" onSearchTextChange={mockOnSearchTextChange} onSearchPress={() => {}} onClearPress={() => {}} />
    );
    fireEvent.changeText(getByPlaceholderText('Search place'), 'New Text');
    expect(mockOnSearchTextChange).toHaveBeenCalledWith('New Text');
  });

  it('calls onSearchPress when search button is pressed', () => {
    const mockOnSearchPress = jest.fn();
    const { getByText } = render(
      <SearchBar searchText="test" onSearchTextChange={() => {}} onSearchPress={mockOnSearchPress} onClearPress={() => {}} />
    );
    fireEvent.press(getByText('Search'));
    expect(mockOnSearchPress).toHaveBeenCalledTimes(1);
  });

  it('calls onClearPress when clear button is pressed', () => {
    const mockOnClearPress = jest.fn();
    const { getByText } = render(
      <SearchBar searchText="test" onSearchTextChange={() => {}} onSearchPress={() => {}} onClearPress={mockOnClearPress} />
    );
    fireEvent.press(getByText('X'));
    expect(mockOnClearPress).toHaveBeenCalledTimes(1);
  });
});

