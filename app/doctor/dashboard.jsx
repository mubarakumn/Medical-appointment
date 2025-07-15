import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import useTheme from '../../hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const DoctorDashboard = () => {
  const { userDetails } = useContext(AuthContext);
  const { themeStyles, theme } = useTheme();
  const router = useRouter();

  const [stats, setStats] = useState({
    appointments: 0,
    slots: 0,
    patients: 0,
    todayAppointments: [],
    upcomingAppointments: [],
    availabilitySummary: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(
        `https://medical-appointment-backend-five.vercel.app/api/users/doctors/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats(res.data);
    } catch (err) {
      if(err.status === 403) {
        router.replace('/auth/Login');
        return;
      }
      console.error(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStats();
  }, []);

  const handleProfile = () => router.push('/doctor/profile');
  const handleNotification = () => router.push('/screens/Notifications');

  const DashboardButton = ({ icon, label, onPress }) => (
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor: themeStyles.card }]}
      onPress={onPress}
    >
      <View style={styles.actionContent}>
        <Text style={styles.actionIcon}>{icon}</Text>
        <Text style={[styles.actionText, { color: themeStyles.text }]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );

  const StatCard = ({ value, label, icon }) => (
    <View style={[styles.statCard, { backgroundColor: themeStyles.card }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color: themeStyles.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: themeStyles.icon }]}>{label}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: themeStyles.background }]}>
        <ActivityIndicator size="large" color={themeStyles.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={themeStyles.background} />

      {/* Top Navbar */}
      <View style={styles.nav}>
        <TouchableOpacity onPress={handleProfile}>
          <View style={styles.navUser}>
            <FontAwesome5 name="user-circle" size={30} color={themeStyles.text} />
            <View>
              <Text style={[styles.navGreeting, { color: themeStyles.text }]}>Welcome back!</Text>
              <Text style={[styles.navName, { color: themeStyles.text }]}>
                Dr. {userDetails.name || 'Doctor'} 👨‍⚕️
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNotification}>
          <MaterialIcons name="notifications" size={30} color={themeStyles.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={themeStyles.primary} />}
      >
        <Text style={[styles.title, { color: themeStyles.text }]}>Doctor Dashboard</Text>

        {/* Stat Cards */}
        <View style={styles.cardsRow}>
          <StatCard value={stats.appointments} label="Appointments" icon="📅" />
          <StatCard value={stats.slots} label="Slots" icon="⏰" />
          <StatCard value={stats.patients} label="Patients" icon="👥" />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeStyles.text }]}>Quick Actions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <DashboardButton icon="➕" label="Add Slot" onPress={() => router.push('/doctor/availability')} />
            <DashboardButton icon="📅" label="Appointments" onPress={() => router.push('/doctor/appointments')} />
          </ScrollView>
        </View>

        {/* Today Appointments */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeStyles.text }]}>Today's Appointments</Text>
          {stats.todayAppointments.length === 0 ? (
            <Text style={{ color: themeStyles.icon }}>No appointments today.</Text>
          ) : (
            stats.todayAppointments.map((appt, index) => (
              <View key={index} style={[styles.appointmentCard, { backgroundColor: themeStyles.card }]}>
                <Text style={{ color: themeStyles.text, fontWeight: 'bold' }}>{appt.patientName}</Text>
                <Text style={{ color: themeStyles.text }}>{new Date(appt.date).toLocaleString()}</Text>
              </View>
            ))
          )}
        </View>

        {/* Upcoming Appointments */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeStyles.text }]}>Upcoming Appointments</Text>
          {stats.upcomingAppointments.length === 0 ? (
            <Text style={{ color: themeStyles.icon }}>No upcoming appointments.</Text>
          ) : (
            stats.upcomingAppointments.map((appt, index) => (
              <Text key={index} style={{ color: themeStyles.text }}>
                • {appt.patientName} on {new Date(appt.date).toLocaleString()}
              </Text>
            ))
          )}
        </View>

        {/* Availability */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeStyles.text }]}>Availability</Text>
          {stats.availabilitySummary.length === 0 ? (
            <Text style={{ color: themeStyles.icon }}>No availability set.</Text>
          ) : (
            stats.availabilitySummary.map((slot, index) => (
              <Text key={index} style={{ color: themeStyles.text }}>
                • {slot.day}: {slot.time}
              </Text>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default DoctorDashboard;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 15, paddingTop: 10 },
  scrollContainer: { paddingBottom: 40 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navUser: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  navGreeting: { fontSize: 13 },
  navName: { fontSize: 16, fontWeight: 'bold' },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  statIcon: { fontSize: 22, marginBottom: 6 },
  statValue: { fontSize: 22, fontWeight: 'bold' },
  statLabel: { fontSize: 13, marginTop: 4 },
  section: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginRight: 12,
    elevation: 1,
  },
  actionContent: { flexDirection: 'row', alignItems: 'center' },
  actionIcon: { fontSize: 18 },
  actionText: { fontSize: 15, marginLeft: 6, fontWeight: '500' },
  appointmentCard: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 1,
  },
});
