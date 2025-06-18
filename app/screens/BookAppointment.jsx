import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import DatePicker from 'react-native-date-picker';
import TopBar from '../../components/TopBar';
import MyButton from '../../components/MyButton';
import useTheme from '../../hooks/useTheme';

const BookAppointment = () => {
  const { themeStyles } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [reason, setReason] = useState('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  const handleBook = () => {
    if (!reason.trim()) {
      Alert.alert('Error', 'Please provide a reason for the appointment.');
      return;
    }

    const appointmentDetails = {
      date: selectedDate.toDateString(),
      time: selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reason,
    };

    console.log('Appointment Details:', appointmentDetails);
    Alert.alert('Success', 'Your appointment has been booked!');
    // Reset the form after booking
    setReason('');
    setSelectedDate(new Date());
    setSelectedTime(new Date());
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <TopBar title="Book Appointment" />

      <View style={styles.content}>
        <Text style={[styles.title, { color: themeStyles.text }]}>Book Appointment</Text>

        {/* Date Picker */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: themeStyles.text }]}>Select Date:</Text>
          <MyButton
            title={selectedDate.toDateString()}
            onPress={() => setIsDatePickerOpen(true)}
          />
          <DatePicker
            modal
            open={isDatePickerOpen}
            date={selectedDate}
            mode="date"
            onConfirm={(date) => {
              setIsDatePickerOpen(false);
              setSelectedDate(date);
            }}
            onCancel={() => setIsDatePickerOpen(false)}
          />
        </View>

        {/* Time Picker */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: themeStyles.text }]}>Select Time:</Text>
          <MyButton
            title={selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            onPress={() => setIsTimePickerOpen(true)}
          />
          <DatePicker
            modal
            open={isTimePickerOpen}
            date={selectedTime}
            mode="time"
            onConfirm={(time) => {
              setIsTimePickerOpen(false);
              setSelectedTime(time);
            }}
            onCancel={() => setIsTimePickerOpen(false)}
          />
        </View>

        {/* Reason Input */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: themeStyles.text }]}>Reason for Appointment:</Text>
          <TextInput
            style={[styles.input, { backgroundColor: themeStyles.card, color: themeStyles.text }]}
            placeholder="Enter reason (e.g., Monthly check-up)"
            placeholderTextColor={themeStyles.icon}
            value={reason}
            onChangeText={setReason}
          />
        </View>

        {/* Book Button */}
        <MyButton title="Book Now" onPress={handleBook} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
});

export default BookAppointment;