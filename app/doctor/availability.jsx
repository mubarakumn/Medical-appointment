import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
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
  const [pickerVisible, setPickerVisible] = useState({});
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
    if (!availability.length) {
      Alert.alert('No rules', 'Please add at least one availability rule.');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const payload = availability.map(rule => ({
        day: rule.day,
        startTime: rule.startTime.toTimeString().slice(0, 5),
        endTime: rule.endTime.toTimeString().slice(0, 5),
        duration: rule.duration,
      }));

      await axios.put(
        'https://medical-appointment-backend-five.vercel.app/api/users/doctors/availability',
        { availability: payload },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert(
        'Success',
        'Your availability has been updated. Slots will be generated for the next 14 days unless changed.'
      );
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to update availability.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <Text style={[styles.title, { color: themeStyles.text }]}>Set Your Weekly Availability</Text>
      <Text style={[styles.note, { color: themeStyles.icon }]}>
        Your availability will be applied to the next 14 days. You can come back anytime to update it.
      </Text>

      {availability.length === 0 && (
        <Text style={[styles.emptyText, { color: themeStyles.icon }]}>
          No availability rules added yet.
        </Text>
      )}

      {availability.map((rule, index) => (
        <View key={index} style={[styles.card, { backgroundColor: themeStyles.card }]}>
          <Text style={[styles.ruleTitle, { color: themeStyles.text }]}>
            Rule {index + 1}
          </Text>

          <Text style={[styles.label, { color: themeStyles.text }]}>Day:</Text>
          <RNPickerSelect
            onValueChange={value => updateRule(index, 'day', value)}
            items={daysOfWeek}
            value={rule.day}
            style={pickerStyle(themeStyles)}
            placeholder={{ label: 'Select Day', value: null }}
          />

          <Text style={[styles.label, { color: themeStyles.text }]}>Start Time:</Text>
          <TouchableOpacity
            onPress={() => setPickerVisible({ index, type: 'start' })}
            style={styles.timeButton}
          >
            <Text style={{ color: themeStyles.icon }}>
              {rule.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.label, { color: themeStyles.text }]}>End Time:</Text>
          <TouchableOpacity
            onPress={() => setPickerVisible({ index, type: 'end' })}
            style={styles.timeButton}
          >
            <Text style={{ color: themeStyles.icon }}>
              {rule.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.label, { color: themeStyles.text }]}>Duration per Slot:</Text>
          <RNPickerSelect
            onValueChange={value => updateRule(index, 'duration', value)}
            items={durations}
            value={rule.duration}
            style={pickerStyle(themeStyles)}
            placeholder={{ label: 'Select Duration', value: null }}
          />

          {pickerVisible.index === index && (
            <DateTimePicker
              mode="time"
              value={
                pickerVisible.type === 'start' ? rule.startTime : rule.endTime
              }
              is24Hour={true}
              display="default"
              onChange={(event, selectedTime) => {
                if (selectedTime) {
                  updateRule(index, pickerVisible.type === 'start' ? 'startTime' : 'endTime', selectedTime);
                }
                setPickerVisible({});
              }}
            />
          )}
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addRule}>
        <Text style={{ color: '#fff' }}>➕ Add Availability Rule</Text>
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
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  note: { fontSize: 14, marginBottom: 15 },
  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  ruleTitle: { fontSize: 16, marginBottom: 5, fontWeight: '600' },
  label: { marginTop: 10, fontWeight: '500' },
  timeButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginTop: 5,
  },
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
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 10,
  },
});

const pickerStyle = (themeStyles) => ({
  inputIOS: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: themeStyles.border,
    color: themeStyles.text,
    backgroundColor: themeStyles.input || '#fff',
    marginBottom: 5,
  },
  inputAndroid: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: themeStyles.border,
    color: themeStyles.text,
    backgroundColor: themeStyles.input || '#fff',
    marginBottom: 5,
  },
});

export default DoctorAvailabilityScreen;
