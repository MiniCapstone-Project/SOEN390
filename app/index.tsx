import { registerRootComponent } from 'expo';
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import Navigation from '../navigation/Navigation';
import { SMARTLOOK_API_KEY } from '@/constants/SmartlookKey'; 
import Smartlook from 'react-native-smartlook-analytics' ;

export default function App() {
  // useEffect(() => {
  //   Smartlook.instance.preferences.setProjectKey(SMARTLOOK_API_KEY);
  // }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Navigation />
    </>
  );
}

registerRootComponent(App);
