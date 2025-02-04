import { StyleSheet } from 'react-native'; 

export const MarkerInfoBoxStyles = StyleSheet.create({
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

export const DefaultMapStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  controlsContainer: {
    position: 'absolute',
    top: 10,
    width: '90%',
    alignSelf: 'center',
  },
  searchBox: {
    marginBottom: 10,
  },
  campusButtons: {
    
  },
  campusButton: {
    // marginHorizontal: 5,
  },
  campusButtonWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  }
});
