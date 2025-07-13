import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useTheme from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const DoctorSlotsScreen = () => {
  const { themeStyles } = useTheme();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateObj, setDateObj] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchSlots = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await axios.get(`https://medical-appointment-backend-five.vercel.app/api/slots/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlots(res.data.slots || []); // your controller returns { slots: [...] }
    } catch (err) {
      Alert.alert('Error', 'Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  const addSlot = async () => {
    if (!dateObj) {
      Alert.alert('Input Required', 'Please select a date and time');
      return;
    }

    setSubmitting(true);
    const token = await AsyncStorage.getItem('token');
    try {
      await axios.post(
        `http://192.168.43.153:3000/api/slots/add`,
        { slot: dateObj.toISOString() },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchSlots();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Could not create slot');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSlot = async (slotDate) => {
    Alert.alert('Delete Slot', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const token = await AsyncStorage.getItem('token');
          try {
            await axios.delete(
              `https://medical-appointment-backend-five.vercel.app/api/slots/remove`,
              {
                headers: { Authorization: `Bearer ${token}` },
                data: { slot: slotDate }, // backend expects date in body
              }
            );
            fetchSlots();
          } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to delete slot');
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const renderSlot = ({ item }) => (
    <View style={[styles.slotCard, { backgroundColor: themeStyles.card }]}>
      <View>
        <Text style={[styles.slotText, { color: themeStyles.text }]}>
          Date: {new Date(item.date).toDateString()}
        </Text>
        <Text style={[styles.slotText, { color: themeStyles.text }]}>
          Time: {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      <TouchableOpacity onPress={() => deleteSlot(item.date)}>
        <Ionicons name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <Text style={[styles.title, { color: themeStyles.text }]}>Manage Available Slots</Text>

      {/* Slot Picker */}
      <View style={styles.form}>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={[styles.input, { justifyContent: 'center' }]}
        >
          <Text style={{ color: themeStyles.text }}>📅 {dateObj.toDateString()}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowTimePicker(true)}
          style={[styles.input, { justifyContent: 'center' }]}
        >
          <Text style={{ color: themeStyles.text }}>
            🕒 {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: themeStyles.secondary }]}
          onPress={addSlot}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>{submitting ? 'Adding...' : '➕ Add Slot'}</Text>
        </TouchableOpacity>
      </View>

      {/* Slot List */}
      {loading ? (
        <ActivityIndicator size="large" color={themeStyles.primary} />
      ) : (
        <FlatList
          data={slots}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderSlot}
          contentContainerStyle={{ paddingBottom: 30 }}
          ListEmptyComponent={<Text style={{ color: themeStyles.icon }}>No slots yet.</Text>}
        />
      )}

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={dateObj}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              const updated = new Date(dateObj);
              updated.setFullYear(selectedDate.getFullYear());
              updated.setMonth(selectedDate.getMonth());
              updated.setDate(selectedDate.getDate());
              setDateObj(updated);
            }
          }}
        />
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={dateObj}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) {
              const updated = new Date(dateObj);
              updated.setHours(selectedTime.getHours());
              updated.setMinutes(selectedTime.getMinutes());
              updated.setSeconds(0);
              setDateObj(updated);
            }
          }}
        />
      )}
    </View>
  );
};

export default DoctorSlotsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 20 },
  form: { marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  slotCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  slotText: {
    fontSize: 16,
  },
});
