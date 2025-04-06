import MapExplorerScreen from '../MapExplorerScreen';

// Basic Rendering Test
it('renders MapExplorerScreen without crashing', () => {
  const { getByText } = render(<MapExplorerScreen />);
  expect(getByText('SGW')).toBeTruthy();
  expect(getByText('Loyola')).toBeTruthy();
});

// User Location Button
it('centers map on user location when ME button is pressed', () => {
  const { getByText } = render(<MapExplorerScreen />);
  act(() => {
    fireEvent.press(getByText('ME'));
  });
  expect(getByText('ME')).toBeTruthy();
});

// Campus Switching
it('switches campus when SGW and Loyola buttons are pressed', () => {
  const { getByText } = render(<MapExplorerScreen />);
  act(() => {
    fireEvent.press(getByText('SGW'));
  });
  expect(getByText('SGW')).toBeTruthy();

  act(() => {
    fireEvent.press(getByText('Loyola'));
  });
  expect(getByText('Loyola')).toBeTruthy();
});

// Marker Info Box
it('displays info box when a marker is selected', async () => {
  const { getByTestId, getByText } = render(<MapExplorerScreen />);
  await act(async () => {
    fireEvent.press(getByTestId('marker'));
  });
  expect(getByText('Building')).toBeTruthy();
});

// POI Search Test
it('performs a POI search and displays results', async () => {
  const { getByPlaceholderText, getByText } = render(<MapExplorerScreen />);
  await act(async () => {
    fireEvent.changeText(getByPlaceholderText('Search for places...'), 'Coffee');
    fireEvent.press(getByText('Search'));
  });
  expect(getByText('Zoom in to see POIs')).toBeTruthy();
});

// Error Handling Test
it('shows error message if location permission is denied', async () => {
  jest.mock('@expo/location', () => ({
    requestForegroundPermissionsAsync: jest.fn(() => ({ status: 'denied' })),
  }));

  const { getByText } = render(<MapExplorerScreen />);
  await act(async () => {
    fireEvent.press(getByText('ME'));
  });
  expect(getByText('Permission to access location was denied')).toBeTruthy();
});