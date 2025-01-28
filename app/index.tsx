import { registerRootComponent } from 'expo';
import React from 'react';
import { StatusBar } from 'react-native';
import Navigation from '../navigation/Navigation';

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Navigation />
    </>
  );
}

registerRootComponent(App);
