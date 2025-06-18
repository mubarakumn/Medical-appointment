import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import useTheme from '../hooks/useTheme'; // Import the useTheme hook

const Button = ({ title, onPress }) => {
  const { themeStyles } = useTheme(); // Destructure themeStyles from useTheme

  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: themeStyles.tint }]} onPress={onPress}>
      <Text style={[styles.buttonText, { color: themeStyles.text }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 5,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Button;