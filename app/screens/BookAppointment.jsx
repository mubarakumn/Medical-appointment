import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import useTheme from '../../hooks/useTheme';
import TopBar from '../../components/TopBar';

const BookAppointment = () => {
  const { doctorId } = useLocalSearchParams();
  const router = useRouter();
  const { themeStyles } = useTheme();

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
        selectedColor: themeStyles.primary || '#2196F3',
      };
    });
    return marked;
  };

  const handleBook = async () => {
    if (!selectedDate || !selectedTime || !reason.trim()) {
      Alert.alert('Error', 'Please select date, time, and provide a reason');
      return;
    }

    // Correct UTC-safe conversion
    const [year, month, day] = selectedDate.split('-').map(Number);
    const [hour, minute] = selectedTime.split(':').map(Number);
    const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
    const isoString = utcDate.toISOString();

    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `https://medical-appointment-backend-five.vercel.app/api/appointments/book`,
        {
          doctorId,
          date: isoString,
          reason,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'Appointment booked', [
        { text: 'OK', onPress: () => router.replace('/') },
      ]);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    if (doctorId) fetchCalendarSlots();
  }, [doctorId]);

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <TopBar title="Book Appointment" />
      <Text style={[styles.title, { color: themeStyles.text }]}>Choose a Date</Text>

      {loading ? (
        <ActivityIndicator size="large" color={themeStyles.primary} />
      ) : (
        <Calendar
          markedDates={markAvailableDates()}
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
            setSelectedTime('');
          }}
          style={styles.calendar}
          theme={{
            backgroundColor: themeStyles.card,
            calendarBackground: themeStyles.card,
            dayTextColor: themeStyles.text,
            monthTextColor: themeStyles.text,
            arrowColor: themeStyles.primary,
          }}
        />
      )}

      {selectedDate && (
        <>
          <Text style={[styles.label, { color: themeStyles.text }]}>
            Available Times for {selectedDate}:
          </Text>

          {slotsByDate[selectedDate]?.length ? (
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
                    {
                      backgroundColor: selectedTime === item
                        ? themeStyles.primary
                        : themeStyles.card,
                      borderColor: themeStyles.primary,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: selectedTime === item ? '#fff' : themeStyles.text,
                      fontWeight: 'bold',
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={{ color: themeStyles.icon, marginBottom: 20 }}>
              No available slots for selected date.
            </Text>
          )}
        </>
      )}

      <Text style={[styles.label, { color: themeStyles.text }]}>Reason for Appointment:</Text>
      <TextInput
        style={[styles.input, {
          borderColor: themeStyles.border,
          color: themeStyles.text,
        }]}
        value={reason}
        onChangeText={setReason}
        placeholder="e.g., headache, general consultation"
        placeholderTextColor={themeStyles.icon}
        multiline
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: themeStyles.primary }]}
        onPress={handleBook}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Confirm Appointment</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BookAppointment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  calendar: {
    marginBottom: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  slot: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
