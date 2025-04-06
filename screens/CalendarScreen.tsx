import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CalendarScreen from '@/screens/CalendarScreen';
import NetInfo from '@react-native-community/netinfo';
import { getEvents, getTodayString } from '../services/eventService';

// Mock NetInfo to simulate offline and online status
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => () => {}),
}));

// Mock the eventService functions
jest.mock('../services/eventService', () => ({
  getEvents: jest.fn(async (type: string) => {
    if (type === 'courses') return { '2023-12-01': [{ id: 1, name: 'Course Event' }] };
    if (type === 'personal') return { '2023-12-01': [{ id: 2, name: 'Personal Event' }] };
    if (type === 'work') return { '2023-12-01': [{ id: 3, name: 'Work Event' }] };
    throw new Error('Failed to fetch events');
  }),
  getTodayString: jest.fn(() => '2023-12-01'),
}));

describe('CalendarScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and shows loading', async () => {
    const { getByText, getByTestId } = render(<CalendarScreen />);
    expect(getByText('Loading events...')).toBeTruthy();
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('shows events when fetched successfully', async () => {
    const { getByText } = render(<CalendarScreen />);
    await waitFor(() => expect(getByText('Course Event')).toBeTruthy());
    await waitFor(() => expect(getByText('Personal Event')).toBeTruthy());
    await waitFor(() => expect(getByText('Work Event')).toBeTruthy());
  });

  it('displays an error message when event fetching fails', async () => {
    (getEvents as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Network error');
    });

    const { getByText } = render(<CalendarScreen />);
    await waitFor(() => expect(getByText('Failed to load events: Network error')).toBeTruthy());
  });

  it('handles network disconnection', async () => {
    (NetInfo.addEventListener as jest.Mock).mockImplementationOnce((callback) =>
      callback({ isConnected: false })
    );

    const { getByText } = render(<CalendarScreen />);
    await waitFor(() => expect(getByText('You are offline. Please check your connection.')).toBeTruthy());
  });

  it('retries fetching events when retry button is clicked', async () => {
    (getEvents as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Initial failure');
    });

    const { getByText, getByTestId } = render(<CalendarScreen />);
    await waitFor(() => expect(getByText('Failed to load events: Initial failure')).toBeTruthy());

    (getEvents as jest.Mock).mockImplementationOnce(async () => ({
      '2023-12-01': [{ id: 4, name: 'Recovered Event' }],
    }));

    const retryButton = getByTestId('retry-button');
    fireEvent.press(retryButton);
    await waitFor(() => expect(getByText('Recovered Event')).toBeTruthy());
  });

  it('updates selected date when a date is clicked', async () => {
    const { getByText } = render(<CalendarScreen />);
    const dateElement = getByText('2023-12-01');
    fireEvent.press(dateElement);
    expect(getByText('Course Event')).toBeTruthy();
  });

  it('shows offline banner when disconnected', async () => {
    (NetInfo.addEventListener as jest.Mock).mockImplementationOnce((callback) =>
      callback({ isConnected: false })
    );

    const { getByText } = render(<CalendarScreen />);
    await waitFor(() => expect(getByText('You are offline. Please check your connection.')).toBeTruthy());
  });

  it('displays loading indicator during fetch', async () => {
    const { getByTestId } = render(<CalendarScreen />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('displays correct calendar type buttons', async () => {
    const { getByText } = render(<CalendarScreen />);
    await waitFor(() => expect(getByText('Courses')).toBeTruthy());
    await waitFor(() => expect(getByText('Personal')).toBeTruthy());
    await waitFor(() => expect(getByText('Work')).toBeTruthy());
  });

  it('handles calendar type toggle', async () => {
    const { getByText } = render(<CalendarScreen />);
    await waitFor(() => expect(getByText('Courses')).toBeTruthy());
    fireEvent.press(getByText('Personal'));
    await waitFor(() => expect(getByText('Personal Event')).toBeTruthy());
  });

  it('handles event list update when changing dates', async () => {
    const { getByText } = render(<CalendarScreen />);
    await waitFor(() => expect(getByText('Course Event')).toBeTruthy());

    fireEvent.press(getByText('2023-12-02'));
    await waitFor(() => expect(getByText('No events scheduled for this day')).toBeTruthy());
  });

  it('shows no events message when there are no events', async () => {
    (getEvents as jest.Mock).mockResolvedValueOnce({});
    const { getByText } = render(<CalendarScreen />);
    await waitFor(() => expect(getByText('No events scheduled for this day')).toBeTruthy());
  });

  it('correctly handles an empty calendar list', async () => {
    (getEvents as jest.Mock).mockResolvedValueOnce(undefined);
    const { getByText } = render(<CalendarScreen />);
    await waitFor(() => expect(getByText('No events scheduled for this day')).toBeTruthy());
  });

  it('displays error if offline mode is active', async () => {
    (NetInfo.addEventListener as jest.Mock).mockImplementationOnce((callback) =>
      callback({ isConnected: false })
    );
    const { getByText } = render(<CalendarScreen />);
    await waitFor(() => expect(getByText('You are offline. Please check your connection.')).toBeTruthy());
  });
});
