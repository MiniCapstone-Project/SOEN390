import { StyleSheet } from 'react-native'; 

export const InputFieldStyles = StyleSheet.create({
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
  },
  searchButton: {
    backgroundColor: '#722F37',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginLeft: 10,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  clearButton: {
    marginLeft: 10,
    padding: 5,
  },
  clearButtonText: {
    color: '#722F37',
    fontWeight: 'bold',
  },
});
