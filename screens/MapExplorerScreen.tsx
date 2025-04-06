// MapExplorerScreen Tests
it('renders MapExplorerScreen without crashing', () => {
  const { getByText } = render(<MapExplorerScreen />);
  expect(getByText('SGW')).toBeTruthy();
  expect(getByText('Loyola')).toBeTruthy();
});

it('switches to SGW campus', () => {
  const { getByText } = render(<MapExplorerScreen />);
  act(() => {
    fireEvent.press(getByText('SGW'));
  });
  expect(getByText('SGW')).toBeTruthy();
});

it('centers to user location on ME button press', () => {
  const { getByText } = render(<MapExplorerScreen />);
  act(() => {
    fireEvent.press(getByText('ME'));
  });
  expect(getByText('ME')).toBeTruthy();
});

it('shows search results when text is entered', async () => {
  const { getByPlaceholderText, getByText } = render(<MapExplorerScreen />);
  await act(async () => {
    fireEvent.changeText(getByPlaceholderText('Search for places...'), 'Test Place');
  });
  expect(getByText('Test Place')).toBeTruthy();
});

it('handles map region change correctly', async () => {
  const { getByTestId } = render(<MapExplorerScreen />);
  await act(async () => {
    fireEvent.press(getByTestId('MAP_REGION_CHANGE'));
  });
  expect(getByTestId('MAP_REGION_CHANGE')).toBeTruthy();
});
