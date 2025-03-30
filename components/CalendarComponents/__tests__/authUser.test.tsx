// __tests__/authUser.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AuthUser from '@/components/CalendarComponents/authUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

// Mocks
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('expo-linking', () => ({
  createURL: jest.fn(() => 'mock-redirect-uri'),
  addEventListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
}));

jest.mock('expo-web-browser', () => ({
  openAuthSessionAsync: jest.fn(() =>
    Promise.resolve({ type: 'cancel', url: '' })
  ),
  maybeCompleteAuthSession: jest.fn(),
}));

describe('AuthUser Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders "Connect Google Calendar" button when user is not logged in', () => {
    const { getByText } = render(<AuthUser />);
    expect(getByText('Connect Google Calendar')).toBeTruthy();
  });

  it('loads and displays user info from AsyncStorage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === '@user') {
        return Promise.resolve(JSON.stringify({ name: 'Test User', email: 'test@example.com' }));
      }
      if (key === '@accessToken') {
        return Promise.resolve('mock-token');
      }
      return null;
    });

    const { getByText } = render(<AuthUser />);
    await waitFor(() => {
      expect(getByText('Name: Test User')).toBeTruthy();
      expect(getByText('Email: test@example.com')).toBeTruthy();
    });
  });

  it('calls WebBrowser.openAuthSessionAsync on button press', async () => {
    const { getByText } = render(<AuthUser />);
    fireEvent.press(getByText('Connect Google Calendar'));
    await waitFor(() => {
      expect(WebBrowser.openAuthSessionAsync).toHaveBeenCalled();
    });
  });
});
