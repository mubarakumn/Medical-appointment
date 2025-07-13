import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function DoctorLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#2196F3' }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          headerShown: false,
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Ionicons name="analytics-outline" color={color} size={size} />,
        }}
        />
      <Tabs.Screen
        name="appointments"
        options={{
          headerShown: false,
          title: 'Appointments',
          tabBarIcon: ({ color, size }) => <Ionicons name="clipboard-outline" color={color} size={size} />,
        }}
        />
      <Tabs.Screen
        name="availability"
        options={{
          headerShown: false,
          title: 'Availability',
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" color={color} size={size} />,
        }}
        />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-circle-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
