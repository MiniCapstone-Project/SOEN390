import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AutocompleteSearchWrapper } from '../AutoCompleteSearchWrapper';
import MapView from 'react-native-maps';
import { View, TextInput, Alert } from 'react-native';

jest.mock('react-native-maps', () => {
  const MockMapView = jest.fn();
  MockMapView.Animated = {
    createAnimatedComponent: jest.fn(),
  };
  return MockMapView;
});

jest.mock('react-native-google-places-autocomplete', () => {
  const React = require('react');
  return {
    GooglePlacesAutocomplete: jest.fn().mockImplementation(({ placeholder, textInputProps }) => (
      React.createElement('View', null,
        React.createElement('TextInput', {
          placeholder: placeholder,
          value: textInputProps.value,
          onChangeText: textInputProps.onChangeText,
          onSubmitEditing: textInputProps.onSubmitEditing
        })
      )
    )),
  };
});

jest.mock('@/services/PlacesService', () => ({
  searchPlaces: jest.fn().mockResolvedValue({
    features: [
      {
        geometry: {
          coordinates: [0, 0],
        },
      },
    ],
  }),
}));

describe('AutocompleteSearchWrapper', () => {
  const mockMapRef = {
    current: {
      getMapBoundaries: jest.fn().mockResolvedValue({
        northEast: { latitude: 1, longitude: 1 },
        southWest: { latitude: 0, longitude: 0 },
      }),
      fitToCoordinates: jest.fn(),
      animateToRegion: jest.fn(),
    },
  };

  const defaultProps = {
    mapRef: mockMapRef,
    setResults: jest.fn(),
    userLocation: { latitude: 0, longitude: 0, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    currentCampus: { latitude: 0, longitude: 0, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    googleMapsKey: 'test-key',
    location: { latitude: 0, longitude: 0, latitudeDelta: 0.1, longitudeDelta: 0.1 },
  };

  beforeEach(() => {
    jest.spyOn(Alert, 'alert').mockClear();
  });

  it('renders correctly', () => {
    const { getByPlaceholderText } = render(<AutocompleteSearchWrapper {...defaultProps} />);
    expect(getByPlaceholderText('Search for places...')).toBeTruthy();
  });

  it('performs a full text search on submit', async () => {
    const { getByPlaceholderText } = render(<AutocompleteSearchWrapper {...defaultProps} />);
    const input = getByPlaceholderText('Search for places...');

    fireEvent.changeText(input, 'test');
    fireEvent(input, 'submitEditing');

    await waitFor(() => {
      expect(defaultProps.setResults).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  it('handles suggestion selection', async () => {
    const { getByPlaceholderText } = render(<AutocompleteSearchWrapper {...defaultProps} />);
    const input = getByPlaceholderText('Search for places...');

    fireEvent.changeText(input, 'test');
    fireEvent(input, 'submitEditing');

    await waitFor(() => {
      expect(defaultProps.setResults).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  it('clears text and results on clear button press', () => {
    const { getByText } = render(<AutocompleteSearchWrapper {...defaultProps} />);
    const clearButton = getByText('Clear');

    fireEvent.press(clearButton);

    expect(defaultProps.setResults).toHaveBeenCalledWith([]);
  });

  it('handles no results found', async () => {
    const { searchPlaces } = require('@/services/PlacesService');
    searchPlaces.mockResolvedValueOnce({
      features: [],
    });

    const { getByPlaceholderText } = render(<AutocompleteSearchWrapper {...defaultProps} />);
    const input = getByPlaceholderText('Search for places...');

    fireEvent.changeText(input, 'test');
    fireEvent(input, 'submitEditing');

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("No Results", "No locations found. Try a different search.", [{ text: "OK" }]);
    });
  });

  it('handles errors during search', async () => {
    const { searchPlaces } = require('@/services/PlacesService');
    searchPlaces.mockRejectedValueOnce(new Error('Failed to fetch places'));

    const { getByPlaceholderText } = render(<AutocompleteSearchWrapper {...defaultProps} />);
    const input = getByPlaceholderText('Search for places...');

    fireEvent.changeText(input, 'test');
    fireEvent(input, 'submitEditing');

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Error", "Failed to fetch places. Please try again.");
    });
  });
});
