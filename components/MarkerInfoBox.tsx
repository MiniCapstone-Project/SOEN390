import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type MarkerInfoBoxProps = {
  title: string;
  address: string;
  onClose: () => void;
  onDirections: () => void;
};

const MarkerInfoBox: React.FC<MarkerInfoBoxProps> = ({ title, address, onClose, onDirections }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.address}>{address}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onDirections}>
          <Text style={styles.buttonText}>Directions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#722F37',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MarkerInfoBox;