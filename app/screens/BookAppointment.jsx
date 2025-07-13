import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar } from 'react-native-calendars';

const BookAppointment = () => {
  const { doctorId } = useLocalSearchParams();
  const router = useRouter();

  const [slotsByDate, setSlotsByDate] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCalendarSlots = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://medical-appointment-backend-five.vercel.app/api/slots/calendar/${doctorId}`);
      setSlotsByDate(res.data || {});
    } catch (err) {
      Alert.alert('Error', 'Could not load available dates');
    } finally {
      setLoading(false);
    }
  };

  const markAvailableDates = () => {
    const marked = {};
    Object.keys(slotsByDate).forEach(date => {
      marked[date] = {
        marked: true,
        selected: date === selectedDate,
        selectedColor: '#2196F3',
      };
    });
    return marked;
  };

  const handleBook = async () => {
    if (!selectedDate || !selectedTime || !reason.trim()) {
      Alert.alert('Error', 'Please select date, time, and reason');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `https://medical-appointment-backend-five.vercel.app/api/appointments/book`,
        {
          doctorId,
          date: `${selectedDate}T${selectedTime}:00`, // ISO format
          reason,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'Appointment booked', [{ text: 'OK', onPress: () => router.replace('/') }]);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    if (doctorId) fetchCalendarSlots();
  }, [doctorId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Appointment</Text>

      {loading && <ActivityIndicator size="large" color="#2196F3" />}

      <Calendar
        markedDates={markAvailableDates()}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        style={{ marginBottom: 20 }}
      />

      {selectedDate && slotsByDate[selectedDate] && (
        <>
          <Text style={styles.label}>Available Times:</Text>
          <FlatList
            data={slotsByDate[selectedDate]}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ gap: 10, marginBottom: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedTime(item)}
                style={[
                  styles.slot,
                  selectedTime === item && styles.selectedSlot,
                ]}
              >
                <Text style={{ color: selectedTime === item ? 'white' : 'black' }}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      <Text style={styles.label}>Reason for Appointment:</Text>
      <TextInput
        style={styles.input}
        value={reason}
        onChangeText={setReason}
        placeholder="E.g., headache, tooth pain..."
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleBook} disabled={loading}>
        <Text style={styles.buttonText}>Book</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BookAppointment;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  label: { fontSize: 16, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    height: 80,
    borderColor: '#ccc',
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  slot: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#2196F3',
  },
  selectedSlot: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
