import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import useTheme from '../../hooks/useTheme';

const _layout = () => {
  const { themeStyles } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: themeStyles.primary,
        tabBarInactiveTintColor: themeStyles.icon,
        tabBarStyle: {
          backgroundColor: themeStyles.card,
          borderTopColor: themeStyles.border,
          height: 60,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <Feather name="home" size={20} color={color} />,
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="AppointmentHistory"
        options={{
          tabBarIcon: ({ color }) => <Feather name="calendar" size={20} color={color} />,
          tabBarLabel: 'History',
        }}
      />
      <Tabs.Screen
        name="UserProfile"
        options={{
          tabBarIcon: ({ color }) => <Feather name="user" size={20} color={color} />,
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  );
};

export default _layout;
