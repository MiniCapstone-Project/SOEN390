/**
 * This screen will be responsible for handling general Settings like: 
 *  - Does the user use Wheel Chair for movement?
 *  - is the User blind?
 *  - is he Deaf?
 */

import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';


export default function SettingsScreen() {
  const handleReset = () => {
    console.log('Reset settings');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings Screen</Text>
      <Button title="Reset Settings" onPress={handleReset} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  text: {
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 20 
  },
});
