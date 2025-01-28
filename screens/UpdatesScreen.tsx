/**
 * This screen will be responsible for connecting with Google Calender 
 * Getting notifications for next class
 * Seeing your scheduale 
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function UpdatesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Updates Screen</Text>
      {/* Add components to display recent updates here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, fontWeight: 'bold' },
});
