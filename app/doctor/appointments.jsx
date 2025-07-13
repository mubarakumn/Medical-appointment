import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import MyButton from '../../components/MyButton';
import useTheme from '../../hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopBar from '../../components/TopBar';

const DoctorAppointmentsScreen = () => {
  const { userDetails } = useContext(AuthContext);
  const { themeStyles, theme } = useTheme();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchAppointments = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await axios.get(
        `https://medical-appointment-backend-five.vercel.app/api/appointments/my?status=${statusFilter}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments(res.data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load appointments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAppointments();
  }, [statusFilter]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAppointments();
  }, [statusFilter]);

  const updateStatus = async (id, status) => {
    const token = await AsyncStorage.getItem('token');
    try {
      await axios.patch(
        `https://medical-appointment-backend-five.vercel.app/api/appointments/update/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments();
    } catch (err) {
      Alert.alert('Error', 'Failed to update appointment status');
    }
  };

  const cancelAppointment = async (id) => {
    const token = await AsyncStorage.getItem('token');
    try {
      await axios.patch(
        `https://medical-appointment-backend-five.vercel.app/api/appointments/cancel/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments();
    } catch (err) {
      Alert.alert('Error', 'Failed to cancel appointment');
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: themeStyles.card }]}>
      <Text style={[styles.text, { color: themeStyles.text }]}>
        🧑 Patient: {item.patient?.name}
      </Text>
      <Text style={[styles.text, { color: themeStyles.text }]}>
        📅 Date: {new Date(item.date).toLocaleString()}
      </Text>
      <Text style={[styles.text, { color: themeStyles.text }]}>
        📌 Status: {item.status}
      </Text>
      <Text style={[styles.text, { color: themeStyles.text }]}>
        📝 Reason: {item.reason}
      </Text>
      {item.notes && (
        <Text style={[styles.text, { color: themeStyles.text }]}>
          📋 Notes: {item.notes}
        </Text>
      )}

      <View style={styles.actions}>
        {item.status === 'pending' && (
          <MyButton title="Confirm" onPress={() => updateStatus(item._id, 'confirmed')} />
        )}
        {item.status === 'confirmed' && (
          <MyButton title="Mark Completed" onPress={() => updateStatus(item._id, 'completed')} />
        )}
        {['pending', 'confirmed'].includes(item.status) && (
          <TouchableOpacity onPress={() => cancelAppointment(item._id)}>
            <Text style={styles.cancel}>❌ Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={themeStyles.card}
      />
      <TopBar title="Appointments" />
      <Text style={[styles.title, { color: themeStyles.text }]}>Your Appointments</Text>

      <View style={styles.filterRow}>
        {['', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => setStatusFilter(s)}
            style={[
              styles.filterBtn,
              {
                borderColor: themeStyles.border,
                backgroundColor: statusFilter === s ? themeStyles.primary : 'transparent',
              },
            ]}
          >
            <Text
              style={{
                color: statusFilter === s ? '#fff' : themeStyles.text,
                fontWeight: statusFilter === s ? 'bold' : 'normal',
              }}
            >
              {s || 'All'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={themeStyles.primary} />
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={themeStyles.primary}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  text: { marginBottom: 5, fontSize: 14 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    alignItems: 'center',
  },
  cancel: {
    color: 'red',
    fontWeight: '600',
    marginTop: 10,
    paddingHorizontal: 8,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
});

export default DoctorAppointmentsScreen;
