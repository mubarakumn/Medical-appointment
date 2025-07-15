import React, { useEffect, useState, useContext } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
  FlatList, TouchableOpacity, StatusBar
} from 'react-native';
import axios from 'axios';
import useTheme from '../../hooks/useTheme';
import TopBar from '../../components/TopBar';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

export default function AdminDashboard() {
  const { themeStyles, theme } = useTheme();
  const { userDetails } = useContext(AuthContext);
  const router = useRouter();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    recentNotifications: []
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get('https://medical-appointment-backend-five.vercel.app/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      if (err.status === 403) {
        router.replace('/auth/Login');
        return;
      }
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const StatCard = ({ value, label, icon, onPress }) => (
    <TouchableOpacity style={[styles.statCard, { backgroundColor: themeStyles.card }]} onPress={onPress}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color: themeStyles.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: themeStyles.icon }]}>{label}</Text>
    </TouchableOpacity>
  );

  const handleNotification = () => {
    router.push('screens/Notifications');
  };

  const Header = () => (
    <View>
      {/* Top Navbar */}
      <View style={styles.nav}>
        <TouchableOpacity>
          <View style={styles.navUser}>
            <FontAwesome5 name="user-circle" size={30} color={themeStyles.text} />
            <View>
              <Text style={[styles.navGreeting, { color: themeStyles.text }]}>Welcome back!</Text>
              <Text style={[styles.navName, { color: themeStyles.text }]}>
                {userDetails.name || 'Admin'} 👤
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNotification}>
          <MaterialIcons name="notifications" size={30} color={themeStyles.text} />
        </TouchableOpacity>
      </View>

      {/* Stat Cards */}
      <View style={styles.cardsRow}>
        <StatCard value={stats.totalUsers} label="Users" icon="👥" onPress={() => router.push('/admin/users')} />
        <StatCard value={stats.totalDoctors} label="Doctors" icon="🩺" onPress={() => router.push('/admin/doctors')} />
        <StatCard value={stats.totalPatients} label="Patients" icon="🧍‍♂️" onPress={() => router.push('/admin/patients')} />
      </View>

      <View style={styles.cardsRow}>
        <StatCard value={stats.totalAppointments} label="Appointments" icon="📅" onPress={() => router.push('/admin/appointments')} />
        <StatCard value={stats.pendingAppointments} label="Pending" icon="⏳" onPress={() => router.push('/admin/appointments?status=pending')} />
        <StatCard value={stats.completedAppointments} label="Completed" icon="✅" onPress={() => router.push('/admin/appointments?status=completed')} />
      </View>

      {/* Notifications Title */}
      <Text style={[styles.sectionTitle, { color: themeStyles.text, marginTop: 30 }]}>
        Latest Notifications
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
        <ActivityIndicator size="large" color={themeStyles.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={themeStyles.background} />

      <FlatList
        data={stats.recentNotifications}
        keyExtractor={(item) => item._id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={Header}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <Text style={{ color: themeStyles.text, opacity: 0.5, textAlign: 'center' }}>
            No recent notifications
          </Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.notificationCard, { backgroundColor: themeStyles.card }]}>
            <Text style={[styles.notifTitle, { color: themeStyles.secondary }]}>{item.title}</Text>
            <Text style={[styles.notifText, { color: themeStyles.text }]}>{item.text}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
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
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statIcon: { fontSize: 26 },
  statValue: { fontSize: 22, fontWeight: 'bold', marginTop: 5 },
  statLabel: { fontSize: 14, color: '#666' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  notificationCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  notifTitle: { fontWeight: 'bold', marginBottom: 4, fontSize: 15 },
  notifText: { fontSize: 14, lineHeight: 18 },
});
