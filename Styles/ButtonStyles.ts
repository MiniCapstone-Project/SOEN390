import { StyleSheet } from 'react-native';

export const CampusSwitchButtonStyle = StyleSheet.create({
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
  });

export const CustomButtonStyles = StyleSheet.create({
    button: {
      backgroundColor: '#722F37',
      alignItems: 'center',
      paddingVertical: 10,
      borderRadius: 5,
      marginHorizontal: 5,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });

export const ButtonsStyles = StyleSheet.create({
  controlsContainer: {
    position: "absolute",
    top: 10,
    width: "90%",
    alignSelf: "center",
    flexDirection: "column",
  },
  searchWrapper: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
})
  