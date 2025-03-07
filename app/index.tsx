import { registerRootComponent } from 'expo';
import React from 'react';
import { StatusBar,Platform } from 'react-native';
import Navigation from '../navigation/Navigation';

import { SMARTLOOK_API_KEY } from '@/constants/SmartlookKey';
import Smartlook from 'react-native-smartlook-analytics'

if (['android', 'ios'].includes(Platform.OS)) {
  console.log(Platform.OS)
  import('react-native-smartlook-analytics').then((Smartlook) => {
      Smartlook.default.instance.preferences.setProjectKey(
        SMARTLOOK_API_KEY 
      );
      console.log(SMARTLOOK_API_KEY)
      console.log(Smartlook)
      Smartlook.default.instance.start();
  });
}

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Navigation />
    </>
  );
}

registerRootComponent(App);
