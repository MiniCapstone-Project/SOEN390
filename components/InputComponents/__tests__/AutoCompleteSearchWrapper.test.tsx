import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AutocompleteSearchWrapper } from '@/components/InputComponents/AutocompleteSearchWrapper';
import MapView from 'react-native-maps';
import { Alert } from 'react-native';
import { searchPlaces } from '@/services/PlacesService';

jest.mock('react-native-maps', () => {
  const MockMapView = jest.fn(() => null);
  MockMapView.Animated = { Region: jest.fn() };
  return { default: MockMapView };
});

jest.mock('@/services/PlacesService', () => ({
  searchPlaces: jest.fn().mockResolvedValue({
    features: [
      {
        geometry: { coordinates: [-73.5673, 45.5017] },
        properties: { name: 'Test Place', formatted_address: '123 Test St', place_id: 'test123' },
      },
    ],
  }),
}));

jest.spyOn(Alert, 'alert');

describe('AutocompleteSearchWrapper', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText } = render(
      <AutocompleteSearchWrapper
        mapRef={React.createRef<MapView>()}
        setResults={jest.fn()}
        userLocation={null}
        currentCampus={{ latitude: 45.5017, longitude: -73.5673 }}
        googleMapsKey="test-key"
        location={null}
        onSearchTextChange={jest.fn()}
      />
    );
    expect(getByPlaceholderText('Search for places, coffee shops, restaurants...')).toBeTruthy();
  });

  it('shows alert if API key is missing', async () => {
    render(<AutocompleteSearchWrapper mapRef={React.createRef<MapView>()} googleMapsKey="" setResults={jest.fn()} />);
    expect(Alert.alert).toHaveBeenCalledWith(
      'Configuration Error',
      'Google Maps API key is missing. Some features may not work correctly.'
    );
  });

  it('handles text input and triggers search', async () => {
    const setResults = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <AutocompleteSearchWrapper
        mapRef={React.createRef<MapView>()}
        setResults={setResults}
        userLocation={null}
        currentCampus={{ latitude: 45.5017, longitude: -73.5673 }}
        googleMapsKey="test-key"
        location={null}
      />
    );

    const input = getByPlaceholderText('Search for places, coffee shops, restaurants...');
    fireEvent.changeText(input, 'Test Place');
    fireEvent.press(getByText('Search'));

    await waitFor(() => {
      expect(searchPlaces).toHaveBeenCalledWith(
        'Test Place',
        45.5017,
        -73.5673,
        'test-key',
        expect.any(Number)
      );
      expect(setResults).toHaveBeenCalled();
    });
  });

  it('clears the search input', async () => {
    const setResults = jest.fn();
    const { getByText, getByPlaceholderText } = render(
      <AutocompleteSearchWrapper
        mapRef={React.createRef<MapView>()}
        setResults={setResults}
        userLocation={null}
        currentCampus={{ latitude: 45.5017, longitude: -73.5673 }}
        googleMapsKey="test-key"
        location={null}
      />
    );

    const input = getByPlaceholderText('Search for places, coffee shops, restaurants...');
    fireEvent.changeText(input, 'Test');
    fireEvent.press(getByText('Clear'));

    await waitFor(() => {
      expect(setResults).toHaveBeenCalledWith({ type: 'FeatureCollection', features: [] });
      expect(input.props.value).toBe("");
    });
  });
});
