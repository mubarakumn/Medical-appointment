import React, { useState, useContext } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import useTheme from '../../hooks/useTheme'; // Import the useTheme hook
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { AuthContext } from '../../context/AuthContext'


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { themeStyles, theme } = useTheme(); // Destructure themeStyles from useTheme
  const { login, setUserDetails } = useContext(AuthContext);

  const navigation = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both fields'); // Use Alert for user feedback
      return;
    }
  
    try {
      const response = await login( email, password);
    
      if (response.status === 200) {
        // Check if the response data contains the expected structure
        if (response.data) {
          setUserDetails(response.data.patient);
          await AsyncStorage.setItem('userDetail', JSON.stringify(response.data.patient)); 
          await AsyncStorage.setItem('token', response.data.token); 
          console.log("use data:", response.data.patient);
          // Profile Completion Check
          if(response.data.patient.profileStatus === 'notComplete'){
            navigation.navigate('auth/AdditionalDetails')
            return;
          }
        
          // Navigate to the home screen after successful login
          navigation.navigate('/'); 
          return;

        } else {
          // If the response is 200 but the data structure is not as expected 
          Alert.alert('Error', 'Unexpected response structure.'); 
          return;
        }
      } else { 
        Alert.alert('Error', response.data.message || 'Login failed'); // Provide feedback on failure
        return; 
      }
    } catch (error) {
      // Check if error.response exists
      console.log(error);
      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 404) {
          Alert.alert('Oops!', 'User not found');
        } else if (error.response.status === 400) {
          Alert.alert('Oops!', 'Invalid credentials');
        } else {
          Alert.alert('Error', error.response.data.message || 'An error occurred during login. Please try again.'); // User-friendly error message
        }
      } else {
        // The request was made but no response was received
        Alert.alert('Error', 'Network error. Please check your connection and try again.');
      }
    }
  };

  const handleSignup = () => {
    navigation.navigate('auth/Signup');
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
       <StatusBar barStyle={theme === 'dark' ? 'light-content' :'dark-content'} backgroundColor={themeStyles.background}  />
      <Text style={[styles.title, { color: themeStyles.text }]}>Login</Text>
      <TextInput
        style={[styles.input, { backgroundColor: themeStyles.card, color: themeStyles.text }]}
        placeholder="Email"
        placeholderTextColor={themeStyles.icon}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, { backgroundColor: themeStyles.card, color: themeStyles.text }]}
        placeholder="Password"
        placeholderTextColor={themeStyles.icon}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={[styles.button, { backgroundColor: themeStyles.text }]} onPress={handleLogin}>
        <Text style={[styles.buttonText, { color: themeStyles.background }]}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignup}>
        <Text style={[styles.link, { color: themeStyles.primary }]}>Don't have an account? Sign up</Text>
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

export default Login;