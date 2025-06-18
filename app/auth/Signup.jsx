import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import useTheme from '../../hooks/useTheme'; // Import the useTheme hook
import axios from 'axios';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { themeStyles } = useTheme(); // Destructure themeStyles from useTheme

  const navigation = useRouter();

  // create an account & move to next step after successful signup
  const handleSignup = async() => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in both fields'); // Use Alert for user feedback
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password don"t match!'); // Use Alert for user feedback
      return;
    }

    navigation.navigate({
      pathname: 'auth/AdditionalDetails',
      params:  {email, password}
    }
    )
  };

  const handleLogin = () => {
    navigation.navigate('auth/Login');
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <Text style={[styles.title, { color: themeStyles.text }]}>Sign Up</Text>
      <TextInput
        style={[styles.input, { backgroundColor: themeStyles.card, color: themeStyles.background }]}
        placeholder="Email"
        placeholderTextColor={themeStyles.icon}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, { backgroundColor: themeStyles.card, color: themeStyles.background }]}
        placeholder="Password"
        placeholderTextColor={themeStyles.icon}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={[styles.input, { backgroundColor: themeStyles.card, color: themeStyles.background }]}
        placeholder="Confirm Password"
        placeholderTextColor={themeStyles.icon}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={[styles.button, { backgroundColor: themeStyles.text }]} onPress={handleSignup}>
        <Text style={[styles.buttonText, { color: themeStyles.background }]}>Next</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogin}>
        <Text style={[styles.link, { color: themeStyles.primary }]}>Already have an account? Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: themeStyles.text }]} onPress={()=> Alert.alert("Coming soon!")}>
        <Text style={[styles.buttonText, { color: themeStyles.background }]}>with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    fontSize: 16,
    marginTop: 20,
  },
});

export default Signup;