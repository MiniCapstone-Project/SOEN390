import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SearchBar, InputField } from '@/components/InputComponents/InputFields';

describe('SearchBar Component', () => {
  it('renders without crashing', () => {
    const { getByPlaceholderText } = render(
      <SearchBar
        searchText=""
        onSearchTextChange={jest.fn()}
        onSearchPress={jest.fn()}
        onClearPress={jest.fn()}
      />
    );
    expect(getByPlaceholderText('Search place')).toBeTruthy();
  });

  it('updates searchText on text change', () => {
    const mockOnSearchTextChange = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar
        searchText=""
        onSearchTextChange={mockOnSearchTextChange}
        onSearchPress={jest.fn()}
        onClearPress={jest.fn()}
      />
    );

    fireEvent.changeText(getByPlaceholderText('Search place'), 'New Text');
    expect(mockOnSearchTextChange).toHaveBeenCalledWith('New Text');
  });

  it('triggers onSearchPress when Search button is pressed', () => {
    const mockOnSearchPress = jest.fn();
    const { getByText } = render(
      <SearchBar
        searchText="Search"
        onSearchTextChange={jest.fn()}
        onSearchPress={mockOnSearchPress}
        onClearPress={jest.fn()}
      />
    );

    fireEvent.press(getByText('Search'));
    expect(mockOnSearchPress).toHaveBeenCalled();
  });

  it('triggers onClearPress when Clear button is pressed', () => {
    const mockOnClearPress = jest.fn();
    const { getByText } = render(
      <SearchBar
        searchText="Clearable"
        onSearchTextChange={jest.fn()}
        onSearchPress={jest.fn()}
        onClearPress={mockOnClearPress}
      />
    );

    fireEvent.press(getByText('X'));
    expect(mockOnClearPress).toHaveBeenCalled();
  });
});

describe('InputField Component', () => {
  it('renders without crashing', () => {
    const { getByPlaceholderText } = render(
      <InputField
        searchText=""
        placeholder="Enter text"
        onSearchTextChange={jest.fn()}
        onSearchPress={jest.fn()}
        onClearPress={jest.fn()}
      />
    );
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('updates searchText on text change', () => {
    const mockOnSearchTextChange = jest.fn();
    const { getByPlaceholderText } = render(
      <InputField
        searchText=""
        placeholder="Enter text"
        onSearchTextChange={mockOnSearchTextChange}
        onSearchPress={jest.fn()}
        onClearPress={jest.fn()}
      />
    );

    fireEvent.changeText(getByPlaceholderText('Enter text'), 'New Text');
    expect(mockOnSearchTextChange).toHaveBeenCalledWith('New Text');
  });

  it('triggers onClearPress when Clear button is pressed', () => {
    const mockOnClearPress = jest.fn();
    const { getByText } = render(
      <InputField
        searchText="Clearable"
        placeholder="Enter text"
        onSearchTextChange={jest.fn()}
        onSearchPress={jest.fn()}
        onClearPress={mockOnClearPress}
      />
    );

    fireEvent.press(getByText('X'));
    expect(mockOnClearPress).toHaveBeenCalled();
  });
});
