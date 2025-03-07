import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import * as Location from 'expo-location';

/**
 * This screen will be responsible for handling general Settings like: 
 *  - Does the user use Wheel Chair for movement?
 *  - Is the User blind?
 *  - Is he Deaf?
 */

export default function SettingsScreen() {
  const handleGetLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings Screen</Text>
      <Button title="Get Location" onPress={handleGetLocation} />
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
