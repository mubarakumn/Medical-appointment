import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from "../context/AuthContext";

const _layout = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Stack initialRouteName="(tabs)">
          {/* Auth Screens */}
          <Stack.Screen name="auth" options={{ headerShown: false }} />

          {/* Main Tabs */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="doctor" options={{ headerShown: false }} />

          {/* Other Screens */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="screens/[doctorId]" options={{ headerShown: false }} />
          <Stack.Screen name="screens/BookAppointment" options={{ headerShown: false }} />
          <Stack.Screen name="screens/Notifications" options={{ headerShown: false }} />
        </Stack> 
      </AuthProvider>
    </ThemeProvider>
  );
};

export default _layout;