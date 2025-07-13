import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import useTheme from '../../hooks/useTheme';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';

const daysOfWeek = [
  { label: 'Monday', value: 'Monday' },
  { label: 'Tuesday', value: 'Tuesday' },
  { label: 'Wednesday', value: 'Wednesday' },
  { label: 'Thursday', value: 'Thursday' },
  { label: 'Friday', value: 'Friday' },
  { label: 'Saturday', value: 'Saturday' },
  { label: 'Sunday', value: 'Sunday' },
];

const durations = [
  { label: '15 minutes', value: 15 },
  { label: '30 minutes', value: 30 },
  { label: '60 minutes', value: 60 },
];

const DoctorAvailabilityScreen = () => {
  const { themeStyles } = useTheme();
  const [availability, setAvailability] = useState([]);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const addRule = () => {
    setAvailability(prev => [
      ...prev,
      {
        day: 'Monday',
        startTime: new Date(),
        endTime: new Date(),
        duration: 30,
      },
    ]);
  };

  const updateRule = (index, key, value) => {
    const updated = [...availability];
    updated[index][key] = value;
    setAvailability(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');

      const payload = availability.map(rule => ({
        day: rule.day,
        startTime: rule.startTime.toTimeString().slice(0, 5), // HH:MM
        endTime: rule.endTime.toTimeString().slice(0, 5),
        duration: rule.duration,
      }));

      await axios.put(
        'http://192.168.43.153:3000/api/users/doctors/availability',
        { availability: payload },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('Success', 'Availability updated and slots generated.');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to update availability.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <Text style={[styles.title, { color: themeStyles.text }]}>Set Weekly Availability</Text>

      {availability.map((rule, index) => (
        <View key={index} style={[styles.card, { backgroundColor: themeStyles.card }]}>
          <Text style={{ color: themeStyles.text, fontWeight: 'bold' }}>Rule {index + 1}</Text>

          <RNPickerSelect
            onValueChange={value => updateRule(index, 'day', value)}
            items={daysOfWeek}
            value={rule.day}
            style={pickerStyle}
            placeholder={{}}
          />

          <TouchableOpacity
            onPress={() => setAdding({ ...adding, showStart: index })}
            style={styles.timeButton}
          >
            <Text style={{ color: themeStyles.icon }}>Start: {rule.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setAdding({ ...adding, showEnd: index })}
            style={styles.timeButton}
          >
            <Text style={{ color: themeStyles.icon }}>End: {rule.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>

          <RNPickerSelect
            onValueChange={value => updateRule(index, 'duration', value)}
            items={durations}
            value={rule.duration}
            style={pickerStyle}
            placeholder={{}}
          />

          {/* Show pickers dynamically */}
          {adding?.showStart === index && (
            <DateTimePicker
              mode="time"
              value={rule.startTime}
              is24Hour={true}
              display="default"
              onChange={(event, selectedTime) => {
                updateRule(index, 'startTime', selectedTime || rule.startTime);
                setAdding({});
              }}
            />
          )}
          {adding?.showEnd === index && (
            <DateTimePicker
              mode="time"
              value={rule.endTime}
              is24Hour={true}
              display="default"
              onChange={(event, selectedTime) => {
                updateRule(index, 'endTime', selectedTime || rule.endTime);
                setAdding({});
              }}
            />
          )}
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addRule}>
        <Text style={{ color: '#fff' }}>➕ Add Rule</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: themeStyles.primary }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save Availability</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  card: { padding: 15, borderRadius: 10, marginBottom: 20 },
  timeButton: { paddingVertical: 10 },
  addButton: {
    backgroundColor: '#555',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
});

const pickerStyle = {
  inputIOS: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#000',
  },
  inputAndroid: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#000',
  },
};

export default DoctorAvailabilityScreen;
