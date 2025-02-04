import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { CampusSwitchButtonStyle, CustomButtonStyles } from "@/Styles/ButtonStyles";
import {
  CampusSwitchProps,
  CustomButtonProps,
} from "@/types/InputComponentTypes";

export const CampusSwitch: React.FC<CampusSwitchProps> = ({
  onCampusSwitch,
  
}) => {
  return (
    <View style={CampusSwitchButtonStyle.buttonContainer}>
      <CustomButton title="Switch to SGW" onPress={onCampusSwitch} />
    </View>
  );
};

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity style={[CustomButtonStyles.button, style]} onPress={onPress}>
      <Text style={[CustomButtonStyles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CampusSwitch;
