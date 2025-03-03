import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { CampusSwitchButtonStyle, CustomButtonStyles } from "@/Styles/ButtonStyles";
import {
  CampusSwitchProps,
  CustomButtonProps,
} from "@/types/InputComponentTypes";

export const CampusSwitch: React.FC<CampusSwitchProps> = ({
  onCampusSwitch,
  title,
  style,
}) => {
  return (
    <View style={CampusSwitchButtonStyle.buttonContainer}>
      <CustomButton title={title} onPress={onCampusSwitch} style={style} />
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
