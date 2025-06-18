import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import React from 'react';

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: 'white',
          position: 'absolute',
          bottom: 20,
          marginHorizontal: 20,
          height: 60,
          borderRadius: 10,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowOffset: {
            width: 10,
            height: 10,
          },
          paddingHorizontal: 20,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Feather name="home" size={20} color={color} />,
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="AppointmentHistory"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Feather name="calendar" size={20} color={color} />,
          tabBarLabel: 'History',
        }}
      />
      <Tabs.Screen
        name="UserProfile"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Feather name="user" size={20} color={color} />,
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  );
};

export default _layout;