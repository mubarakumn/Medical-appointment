import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';

const BookAppointment = () => {
  const { doctorId } = useLocalSearchParams(); // doctorId passed from doctor list or profile
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState('');
  const router = useRouter();

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://medical-appointment-backend-five.vercel.app/api/slots/${doctorId}`);
      setSlots(res.data.slots || []);
    } catch (err) {
      Alert.alert('Error', 'Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  const bookAppointment = async () => {
    if (!selectedSlot || !reason.trim()) {
      Alert.alert('Error', 'Please select a slot and provide a reason');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.post(
        'https://medical-appointment-backend-five.vercel.app/api/appointments/book',
        {
          doctorId,
          date: selectedSlot,
          reason,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert('Success', 'Appointment booked successfully', [
        { text: 'OK', onPress: () => router.replace('/') },
      ]);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctorId) fetchSlots();
  }, [doctorId]);

  const renderSlot = ({ item }) => {
    const isSelected = selectedSlot === item.date;
    const slotTime = new Date(item.date).toLocaleString();

    return (
      <TouchableOpacity
        onPress={() => setSelectedSlot(item.date)}
        style={[styles.slot, isSelected && styles.selectedSlot]}
      >
        <Text style={{ color: isSelected ? 'white' : 'black' }}>{slotTime}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Appointment</Text>

      {loading && <ActivityIndicator size="large" color="#2196F3" />}

      <Text style={styles.label}>Select Slot:</Text>
      <FlatList
        data={slots}
        renderItem={renderSlot}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        contentContainerStyle={{ gap: 10 }}
        style={{ marginBottom: 20 }}
      />

      <Text style={styles.label}>Reason for Appointment:</Text>
      <TextInput
        style={styles.input}
        placeholder="E.g., Back pain, fever..."
        value={reason}
        onChangeText={setReason}
        multiline
      />

      <TouchableOpacity onPress={bookAppointment} style={styles.button} disabled={loading}>
        <Text style={styles.buttonText}>Book</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    height: 100,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  slot: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#2196F3',
    marginBottom: 10,
  },
  selectedSlot: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default BookAppointment;
