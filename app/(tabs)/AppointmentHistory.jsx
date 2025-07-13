import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import useTheme from '../../hooks/useTheme';
import axios from 'axios';
import TopBar from '../../components/TopBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppointmentHistory = () => {
  const { themeStyles } = useTheme();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(
        'https://medical-appointment-backend-five.vercel.app/api/appointments/my',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAppointments(res.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch appointments.');
    } finally {
      setLoading(false);
    }
  };

  // Cancel appointment
  const handleCancel = (appointmentId) => {
    Alert.alert('Cancel Appointment', 'Are you sure?', [
      { text: 'No' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            await axios.put(
              `https://medical-appointment-backend-five.vercel.app/api/appointments/${appointmentId}/cancel`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            Alert.alert('Success', 'Appointment cancelled successfully.');
            fetchAppointments(); // Refresh
          } catch (err) {
            Alert.alert('Error', 'Could not cancel appointment.');
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Each appointment item
  const renderItem = ({ item }) => {
    const appointmentDate = new Date(item.date);
    const isUpcoming = appointmentDate > new Date();

    return (
      <View style={[styles.card, { backgroundColor: themeStyles.card }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.doctorName, { color: themeStyles.text }]}>
            {item.doctor?.name || 'Doctor'}
          </Text>
          <Text style={[styles.status, { color: item.status === 'cancelled' ? 'red' : '#2196F3' }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
        <Text style={[styles.text, { color: themeStyles.icon }]}>
          Specialization: {item.doctor?.specialization}
        </Text>
        <Text style={[styles.text, { color: themeStyles.icon }]}>
          Date: {appointmentDate.toLocaleString()}
        </Text>
        {isUpcoming && item.status === 'pending' && (
          <TouchableOpacity onPress={() => handleCancel(item._id)}>
            <Text style={[styles.cancelText, { color: 'red' }]}>Cancel Appointment</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <TopBar title="Appointment History" />
      {loading ? (
        <ActivityIndicator size="large" color={themeStyles.primary} />
      ) : appointments.length === 0 ? (
        <Text style={[styles.emptyText, { color: themeStyles.text }]}>
          No appointment records found.
        </Text>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default AppointmentHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  card: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
  },
  status: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  cancelText: {
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  emptyText: {
    fontSize: 16,
    marginTop: 40,
    textAlign: 'center',
  },
});

