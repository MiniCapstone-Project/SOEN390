import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { InputFieldStyles } from '@/Styles/InputFieldStyles';
import { SearchBarProps } from '@/types/InputComponentTypes';


export const SearchBar: React.FC<SearchBarProps> = ({ searchText, onSearchTextChange, onSearchPress, onClearPress, style }) => {
  return (
    <View style={[InputFieldStyles.searchBox, style]}>
      <TextInput
        style={InputFieldStyles.input}
        placeholder="Search place"
        value={searchText}
        onChangeText={onSearchTextChange}
      />
      <TouchableOpacity style={InputFieldStyles.searchButton} onPress={onSearchPress}>
        <Text style={InputFieldStyles.searchButtonText}>Search</Text>
      </TouchableOpacity>
      {searchText.length > 0 && (
        <TouchableOpacity style={InputFieldStyles.clearButton} onPress={onClearPress}>
          <Text style={InputFieldStyles.clearButtonText}>X</Text>
        </TouchableOpacity>
      )}
    </View>
  );

};

// Return up the tree
export const InputField: React.FC<SearchBarProps> = ({ searchText, onSearchTextChange, onSearchPress, onClearPress, style, placeholder }) => {
  const handleTextChange = (text: string) => {
    onSearchTextChange(text);
  };

  return (
    <View style={[InputFieldStyles.searchBox, style]}>
      <TextInput
        style={InputFieldStyles.input}
        placeholder={placeholder}
        value={searchText}
        onChangeText={handleTextChange}
      />
      {searchText.length > 0 && (
        <TouchableOpacity style={InputFieldStyles.clearButton} onPress={onClearPress}>
          <Text style={InputFieldStyles.clearButtonText}>X</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};