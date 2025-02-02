import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MarkerInfoBoxProps } from '@/types/MapTypes';
import { MarkerInfoBoxStyles } from '@/Styles/MapStyles';

const MarkerInfoBox: React.FC<MarkerInfoBoxProps> = ({ title, address, onClose, onDirections }) => {
  return (
    <View style={MarkerInfoBoxStyles.container}>
      <Text style={MarkerInfoBoxStyles.title}>{title}</Text>
      <Text style={MarkerInfoBoxStyles.address}>{address}</Text>
      <View style={MarkerInfoBoxStyles.buttonContainer}>
        <TouchableOpacity style={MarkerInfoBoxStyles.button} onPress={onClose}>
          <Text style={MarkerInfoBoxStyles.buttonText}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity style={MarkerInfoBoxStyles.button} onPress={onDirections}>
          <Text style={MarkerInfoBoxStyles.buttonText}>Directions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default MarkerInfoBox;