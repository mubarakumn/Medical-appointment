import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from "../context/AuthContext";

const RootLayout = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Stack initialRouteName="(tabs)">
          {/* Auth Group */}
          <Stack.Screen name="auth" options={{ headerShown: false }} />

          {/* Main Tab Navigation */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* Screens Group */}
          <Stack.Screen name="screens/[doctorId]" options={{ headerShown: false }} />
          <Stack.Screen name="screens/BookAppointment" options={{ headerShown: false }} />
          <Stack.Screen name="screens/Notifications" options={{ headerShown: false }} />
          <Stack.Screen name="admin" options={{ headerShown: false }} />
          <Stack.Screen name="doctor" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default RootLayout;
