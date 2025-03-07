import { SwitchButtonsProps } from '@/types/MapComponentTypes';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';


const SwitchButtons: React.FC<SwitchButtonsProps> = ({ onSwitchToSGW, onSwitchToLoyola }) => {
  return (
    <View style={styles.buttonContainer}>
      <Button mode="contained" onPress={onSwitchToSGW} style={styles.button}>
        Switch to SGW
      </Button>
      <Button mode="contained" onPress={onSwitchToLoyola} style={styles.button}>
        Switch to Loyola
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    backgroundColor: '#722F37',
    alignItems: 'center',
    paddingVertical: 0.5,
    borderRadius: 10,
    marginHorizontal: 5,
  },
});

export default SwitchButtons;