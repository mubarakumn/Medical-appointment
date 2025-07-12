import React, { useState, useContext } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import useTheme from '../../hooks/useTheme'; // Import the useTheme hook
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { AuthContext } from '../../context/AuthContext';
import { ActivityIndicator } from 'react-native';



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { themeStyles, theme } = useTheme(); // Destructure themeStyles from useTheme
  const { login, setUserDetails } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);


  const navigation = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both fields'); // Use Alert for user feedback
      return;
    }
    
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      Alert.alert('Login failed', err?.response?.data?.message || 'Something went wrong');
    }finally{
      setLoading(false);
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
      <TouchableOpacity disabled={loading} style={[styles.button, { backgroundColor: themeStyles.text }]} onPress={handleLogin}>
        {loading
          ? <ActivityIndicator color={themeStyles.background} />
          : <Text style={[styles.buttonText, { color: themeStyles.background }]}>Login</Text>}
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    zIndex: 999,
  },

});

export default Login;