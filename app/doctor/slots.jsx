import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MyButton from '../../components/MyButton';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import useTheme from '../../hooks/useTheme';
import TopBar from '../../components/TopBar'


const AddSlotScreen = () => {
  const { user } = useContext(AuthContext);
  const { themeStyles } = useTheme();

  const [slots, setSlots] = useState([]);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchSlots = async () => {
    try {
      const res = await axios.get(`https://medical-appointment-backend-five.vercel.app/api/slots/${user._id}`);
      setSlots(res.data.slots);
    } catch (err) {
      console.log('Error fetching slots:', err);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleAddSlot = async () => {
    try {
      const res = await axios.post(
        'https://medical-appointment-backend-five.vercel.app/api/slots/add',
        { slot: selectedDate },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setSlots(res.data.slots);
      Alert.alert('Success', 'Slot added!');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to add slot');
    }
  };

  const handleRemoveSlot = async (slotDate) => {
    try {
      const res = await axios.delete(
        'https://medical-appointment-backend-five.vercel.app/api/slots/remove',
        {
          data: { slot: slotDate },
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setSlots(res.data.slots);
    } catch (err) {
      Alert.alert('Error', 'Failed to remove slot');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <TopBar 
      title={"Dashboard"}
      />
      <View >
        <Text style={[styles.title, { color: themeStyles.text }]}>Add Available Slot</Text>

        <MyButton
          title="Select Date & Time"
          onPress={() => setDatePickerVisible(true)}
        />

        <DateTimePickerModal
          isVisible={datePickerVisible}
          mode="datetime"
          onConfirm={(date) => {
            setSelectedDate(date);
            setDatePickerVisible(false);
            handleAddSlot();
          }}
          onCancel={() => setDatePickerVisible(false)}
        />

        <Text style={[styles.subtitle, { color: themeStyles.text }]}>Current Slots:</Text>
        <FlatList
          data={slots}
          keyExtractor={(item) => item.date}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: themeStyles.card }]}>
              <Text style={{ color: themeStyles.text }}>{new Date(item.date).toLocaleString()}</Text>
              <TouchableOpacity onPress={() => handleRemoveSlot(item.date)}>
                <Text style={{ color: 'red', marginTop: 5 }}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 10 },
  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 3,
  },
});

export default AddSlotScreen;
