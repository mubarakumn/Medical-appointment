import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  StatusBar,
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
  const [stats, setStats] = useState({
    appointments: 0,
    slots: 0,
    patients: 0,
    todayAppointments: [],
    upcomingAppointments: [],
    availabilitySummary: [],
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchStats = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await axios.get(
        `https://medical-appointment-backend-five.vercel.app/api/users/doctors/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats(res.data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleProfile = () => {
    router.push('/doctor/profile');
  };

  const handleNotification = () => {
    router.push('/screens/Notifications');
  };

  const DashboardButton = ({ icon, label, onPress }) => (
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor: themeStyles.card }]}
      onPress={onPress}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 18 }}>{icon}</Text>
        <Text style={[styles.actionText, { color: themeStyles.text, marginLeft: 8 }]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );


  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: themeStyles.background }]}>
        <ActivityIndicator size="large" color={themeStyles.primary} />
      </View>
    );
  }
  const StatCard = ({ value, label, icon }) => {
    const { themeStyles } = useTheme();
    return (
      <View style={[styles.statCard, { backgroundColor: themeStyles.card }]}>
        <Text style={styles.statIcon}>{icon}</Text>
        <Text style={[styles.statValue, { color: themeStyles.text }]}>{value}</Text>
        <Text style={[styles.statLabel, { color: themeStyles.text }]}>{label}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.card }]}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={themeStyles.card}
      />

      {/* Top Navbar */}
      <View style={styles.nav}>
        <TouchableOpacity onPress={handleProfile}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <FontAwesome5 name="user-circle" size={30} color={themeStyles.text} />
            <View>
              <Text style={[styles.navText, { color: themeStyles.text }]}>Welcome back!</Text>
              <Text style={[styles.navText, { fontWeight: 'bold', color: themeStyles.text }]}>
                {userDetails.name || 'Doctor'} 👨‍⚕️
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNotification}>
          <MaterialIcons name="notifications" size={30} color={themeStyles.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={[styles.title, { color: themeStyles.text }]}>Doctor Dashboard</Text>

        {/* Stat Cards */}
        <View style={styles.cardsRow}>
          <StatCard value={stats.appointments} label="Appointments" icon="📅" />
          <StatCard value={stats.slots} label="Slots" icon="⏰" />
          <StatCard value={stats.patients} label="Patients" icon="👥" />
        </View>


        {/* Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeStyles.text }]}>Quick Actions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <DashboardButton icon="➕" label="Add Slot" onPress={() => router.push('/doctor/availability')} />
            <DashboardButton icon="📅" label="Appointments" onPress={() => router.push('/doctor/appointments')} />
            {/* <DashboardButton icon="👥" label="Patients" onPress={() => router.push('/doctor/patients')} /> */}
          </ScrollView>
        </View>


        {/* 📅 Today’s Appointments */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeStyles.text }]}>Today's Appointments</Text>
          {stats.todayAppointments.length === 0 ? (
            <Text style={{ color: themeStyles.icon }}>No appointments today.</Text>
          ) : (
            stats.todayAppointments.map((appt, index) => (
              <View key={index} style={[styles.appointmentCard, { backgroundColor: themeStyles.background }]}>
                <Text style={{ color: themeStyles.text, fontWeight: 'bold' }}>{appt.patientName}</Text>
                <Text style={{ color: themeStyles.text }}>{new Date(appt.date).toLocaleString()}</Text>
              </View>
            ))
          )}
        </View>

        {/* 🔜 Upcoming Appointments */}
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

        {/* 🕒 Availability */}
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

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 15 },
  scrollContainer: { flexGrow: 1, padding: 5 , paddingBottom: 50},
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  navText: {
    color: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    gap: 10,
  },
  statCard: {
    flex: 1,
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },

  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  statLabel: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  card: {
    padding: 12,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 4,
    width: '30%', // or use Dimensions to calculate 33%
    minWidth: 100,
    backgroundColor: '#fff',
  },
  section: {
    marginTop: 30,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginRight: 10,
    elevation: 2,
    minWidth: 140,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  appointmentCard: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },

});

export default DoctorDashboard;
