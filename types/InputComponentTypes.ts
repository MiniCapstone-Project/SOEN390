import { ViewStyle, TextStyle } from "react-native";

export type CampusSwitchProps = {
    title: string;
    onPress: () => void;
    onSwitchToSGW: () => void;
    onSwitchToLoyola: () => void;
};

export type CustomButtonProps = {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
};


export type SearchBarProps = {
    searchText: string;
    onSearchTextChange: (text: string) => void;
    onSearchPress: () => void;
    onClearPress: () => void;
    style?: ViewStyle;
};
