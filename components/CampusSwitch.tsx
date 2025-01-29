import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomButton from './CustomButton';

type CampusSwitchProps = {
  onSwitchToSGW: () => void;
  onSwitchToLoyola: () => void;
};

const CampusSwitch: React.FC<CampusSwitchProps> = ({ onSwitchToSGW, onSwitchToLoyola }) => {
  return (
    <View style={styles.buttonContainer}>
      <CustomButton title="Switch to SGW" onPress={onSwitchToSGW} />
      <CustomButton title="Switch to Loyola" onPress={onSwitchToLoyola} />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default CampusSwitch;