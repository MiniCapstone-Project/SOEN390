import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


// Screens
import MapExplorerScreen from '../screens/MapExplorerScreen';
import DirectionsScreen from '../screens/DirectionsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import UpdatesScreen from '../screens/UpdatesScreen';

// Tab Navigator
const Tab = createBottomTabNavigator();
export default function Navigation() {
    return (
        <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
            // Initialize iconName with a valid Ionicons name
            let iconName: keyof typeof Ionicons.glyphMap = 'home'; // Default fallback

            if (route.name === 'Map') {
                iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Directions') {
                iconName = focused ? 'navigate' : 'navigate-outline';
            } else if (route.name === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline';
            } else if (route.name === 'Updates') {
                iconName = focused ? 'information-circle' : 'information-circle-outline';
            }

            // Return the Ionicons component with a valid `name` prop
            return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#722F37',
            tabBarInactiveTintColor: 'gray',
        })}
        >
        <Tab.Screen name="Campus Guide" component={MapExplorerScreen} />
        <Tab.Screen name="Directions" component={DirectionsScreen} />
        <Tab.Screen name="Updates" component={UpdatesScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}
