import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, StatusBar } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import MyButton from '../../components/MyButton';
import useTheme from '../../hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopBar from '../../components/TopBar'



const DoctorAppointmentsScreen = () => {
  const { userDetails } = useContext(AuthContext);
  const { themeStyles, theme } = useTheme();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  
  
  const fetchAppointments = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      setLoading(true);
      const res = await axios.get(
        `https://medical-appointment-backend-five.vercel.app/api/appointments/my?status=${statusFilter}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments(res.data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      const res = await axios.patch(
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

      <View style={styles.actions}>
        {item.status === 'pending' && (
          <MyButton title="Confirm" onPress={() => updateStatus(item._id, 'confirmed')} />
        )}
        {item.status === 'confirmed' && (
          <MyButton title="Mark Completed" onPress={() => updateStatus(item._id, 'completed')} />
        )}
        {item.status !== 'cancelled' && (
          <TouchableOpacity onPress={() => cancelAppointment(item._id)}>
            <Text style={styles.cancel}>❌ Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={themeStyles.card} />

      <TopBar 
      title={"Appointments"}
      />
      <Text style={[styles.title, { color: themeStyles.text }]}>Your Appointments</Text>

      <View style={styles.filterRow}>
        {['', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => setStatusFilter(s)}
            style={[
              styles.filterBtn,
              statusFilter === s && { backgroundColor: themeStyles.primary },
            ]}
          >
            <Text style={{ color: themeStyles.text }}>{s || 'All'}</Text>
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
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 3,
  },
  text: { marginBottom: 5 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  cancel: { color: 'red', marginTop: 5 },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 10,
    flexWrap: 'wrap',
    gap: 5,
  },
  filterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 8,
  },
});

export default DoctorAppointmentsScreen;
