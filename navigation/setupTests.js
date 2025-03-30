jest.mock("../screens/MapExplorerScreen.tsx", () => {
  const React = require("react");
  return () => <React.Fragment />;
});

jest.mock("../screens/DirectionsScreen.tsx", () => {
  const React = require("react");
  return () => <React.Fragment />;
});


// Mock react-native-maps to prevent Jest errors
jest.mock("react-native-maps", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: React.forwardRef(() => <View />),
    Marker: () => <View />,
    Polyline: () => <View />,
    PROVIDER_GOOGLE: "google"
  };
});

// Mock AsyncStorage to prevent Jest errors
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}));

// Mock expo-font to avoid forEach error
jest.mock("expo-font", () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn().mockReturnValue(true)
}));

// Mock react-native-vector-icons to prevent rendering issues
jest.mock("react-native-vector-icons/Ionicons", () => "Ionicons");

jest.mock("constants/GoogleKey", () => ({
  AND_CLIENT_ID: "mock-client-id"
}));