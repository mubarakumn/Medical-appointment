import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, FlatList,
  TouchableOpacity, Alert, StyleSheet
} from 'react-native';
import axios from 'axios';
import useTheme from '../../hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const { themeStyles } = useTheme();

  const fetchAppointments = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get('https://medical-appointment-backend-five.vercel.app/api/admin/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(res.data);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch appointments');
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Confirm', 'Cancel this appointment?', [
      { text: 'Cancel' },
      {
        text: 'Yes, Cancel',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`https://medical-appointment-backend-five.vercel.app/api/admin/appointments/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            fetchAppointments(); // Refresh
          } catch (err) {
            Alert.alert('Error', 'Failed to cancel appointment');
          }
        }
      }
    ]);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter(item =>
    item.patient?.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.doctor?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <Text style={[styles.header, { color: themeStyles.text }]}>Appointments</Text>

      <TextInput
        style={[styles.input, { borderColor: themeStyles.border, color: themeStyles.text }]}
        placeholder="Search by doctor or patient"
        placeholderTextColor={themeStyles.icon}
        value={search}
        onChangeText={setSearch}
      />

      {filteredAppointments.length === 0 ? (
        <Text style={{ color: themeStyles.icon, textAlign: 'center', marginTop: 30 }}>
          No appointments found.
        </Text>
      ) : (
        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={[styles.card, { borderColor: themeStyles.border }]}>
              <Text style={[styles.boldText, { color: themeStyles.text }]}>
                Patient: {item.patient?.name ?? 'Unknown'}
              </Text>
              <Text style={{ color: themeStyles.icon }}>
                Doctor: {item.doctor?.name ?? 'Unknown'}
              </Text>
              <Text style={{ color: themeStyles.icon }}>
                Date: {new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <Text style={{ color: themeStyles.icon }}>
                Status: {item.status}
              </Text>

              <TouchableOpacity onPress={() => handleDelete(item._id)}>
                <Text style={{ color: 'red', marginTop: 5 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Appointments;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  card: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 3,
  },
});
