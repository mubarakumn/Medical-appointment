// import { View, Text, StyleSheet } from 'react-native'
// import React from 'react'
// import TopBar from '../../components/TopBar'
// import useTheme from '../../hooks/useTheme'

// export default function AppointmentHistory() {
//   const { themeStyles } = useTheme();

//   return (
//     <View style={[styles.container, { backgroundColor: themeStyles.background}]}>
//       <TopBar
//       title={"Appointment History"}
//       />
//       <Text>AppointmentHistory</Text>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//   },
// })

import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import useTheme from '../../hooks/useTheme';
import axios from 'axios';
import MyButton from '../../components/MyButton';

const PatientAppointmentsScreen = () => {
  const { user } = useContext(AuthContext);
  const { themeStyles } = useTheme();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`https://your-backend/api/appointments/my`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    Alert.alert('Cancel Appointment', 'Are you sure?', [
      { text: 'No' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            await axios.put(`https://your-backend/api/appointments/${id}/cancel`, {}, {
              headers: { Authorization: `Bearer ${user.token}` },
            });
            Alert.alert('Cancelled', 'Appointment has been cancelled.');
            fetchAppointments(); // refresh
          } catch (err) {
            Alert.alert('Error', 'Unable to cancel appointment.');
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const renderItem = ({ item }) => {
    const isUpcoming = new Date(item.date) > new Date();
    return (
      <View style={[styles.card, { backgroundColor: themeStyles.card }]}>
        <Text style={[styles.title, { color: themeStyles.text }]}>{item.doctor.name}</Text>
        <Text style={{ color: themeStyles.icon }}>Specialization: {item.doctor.specialization}</Text>
        <Text style={{ color: themeStyles.icon }}>Date: {new Date(item.date).toLocaleString()}</Text>
        <Text style={{ color: themeStyles.icon }}>Status: {item.status}</Text>
        {isUpcoming && item.status === 'pending' && (
          <TouchableOpacity onPress={() => cancelAppointment(item._id)}>
            <Text style={[styles.cancelText, { color: 'red' }]}>Cancel Appointment</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <Text style={[styles.header, { color: themeStyles.text }]}>My Appointments</Text>
      {loading ? (
        <ActivityIndicator color={themeStyles.primary} size="large" />
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={{ color: themeStyles.icon }}>No appointments yet.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  cancelText: { marginTop: 10, fontWeight: 'bold' },
});

export default PatientAppointmentsScreen;
