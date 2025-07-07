// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
// import DatePicker from 'react-native-date-picker';
// import TopBar from '../../components/TopBar';
// import MyButton from '../../components/MyButton';
// import useTheme from '../../hooks/useTheme';

// const BookAppointment = () => {
//   const { themeStyles } = useTheme();
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [selectedTime, setSelectedTime] = useState(new Date());
//   const [reason, setReason] = useState('');
//   const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
//   const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

//   const handleBook = () => {
//     if (!reason.trim()) {
//       Alert.alert('Error', 'Please provide a reason for the appointment.');
//       return;
//     }

//     const appointmentDetails = {
//       date: selectedDate.toDateString(),
//       time: selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       reason,
//     };

//     console.log('Appointment Details:', appointmentDetails);
//     Alert.alert('Success', 'Your appointment has been booked!');
//     // Reset the form after booking
//     setReason('');
//     setSelectedDate(new Date());
//     setSelectedTime(new Date());
//   };

//   return (
//     <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
//       <TopBar title="Book Appointment" />

//       <View style={styles.content}>
//         <Text style={[styles.title, { color: themeStyles.text }]}>Book Appointment</Text>

//         {/* Date Picker */}
//         <View style={styles.section}>
//           <Text style={[styles.label, { color: themeStyles.text }]}>Select Date:</Text>
//           <MyButton
//             title={selectedDate.toDateString()}
//             onPress={() => setIsDatePickerOpen(true)}
//           />
//           <DatePicker
//             modal
//             open={isDatePickerOpen}
//             date={selectedDate}
//             mode="date"
//             onConfirm={(date) => {
//               setIsDatePickerOpen(false);
//               setSelectedDate(date);
//             }}
//             onCancel={() => setIsDatePickerOpen(false)}
//           />
//         </View>

//         {/* Time Picker */}
//         <View style={styles.section}>
//           <Text style={[styles.label, { color: themeStyles.text }]}>Select Time:</Text>
//           <MyButton
//             title={selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//             onPress={() => setIsTimePickerOpen(true)}
//           />
//           <DatePicker
//             modal
//             open={isTimePickerOpen}
//             date={selectedTime}
//             mode="time"
//             onConfirm={(time) => {
//               setIsTimePickerOpen(false);
//               setSelectedTime(time);
//             }}
//             onCancel={() => setIsTimePickerOpen(false)}
//           />
//         </View>

//         {/* Reason Input */}
//         <View style={styles.section}>
//           <Text style={[styles.label, { color: themeStyles.text }]}>Reason for Appointment:</Text>
//           <TextInput
//             style={[styles.input, { backgroundColor: themeStyles.card, color: themeStyles.text }]}
//             placeholder="Enter reason (e.g., Monthly check-up)"
//             placeholderTextColor={themeStyles.icon}
//             value={reason}
//             onChangeText={setReason}
//           />
//         </View>

//         {/* Book Button */}
//         <MyButton title="Book Now" onPress={handleBook} />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//   },
//   content: {
//     flex: 1,
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   section: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 10,
//   },
//   input: {
//     height: 50,
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     fontSize: 16,
//   },
// });

// export default BookAppointment;
// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, TextInput, Alert, ScrollView } from 'react-native';
// import axios from 'axios';
// import { Picker } from '@react-native-picker/picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';


// const BASE_URL = 'https://medical-appointment-backend-five.vercel.app';

// export default function BookAppointment() {
//   const [doctors, setDoctors] = useState([]);
//   const [selectedDoctor, setSelectedDoctor] = useState('');
//   const [slots, setSlots] = useState({});
//   const [selectedDate, setSelectedDate] = useState('');
//   const [selectedTime, setSelectedTime] = useState('');
//   const [reason, setReason] = useState('');

  
  
//   useEffect(() => {
//     axios.get(`${BASE_URL}/api/users/doctors`)
//       .then(res => setDoctors(res.data))
//       .catch(err => console.error(err));
//     }, []);
    
//     useEffect(() => {
//       if (selectedDoctor) {
//         axios.get(`${BASE_URL}/api/slots/calendar/${selectedDoctor}`)
//         .then(res => setSlots(res.data))
//         .catch(err => console.error(err));
//       }
//     }, [selectedDoctor]);
    
//     const handleBook = async () => {

//     const userToken = await AsyncStorage.getItem('token');

//     if (!selectedDoctor || !selectedDate || !selectedTime || !reason) {
//       return Alert.alert('Missing Fields', 'Please complete all fields.');
//     }

//     const isoDate = new Date(`${selectedDate}T${selectedTime}:00Z`).toISOString();

//     try {
//       const res = await axios.post(`${BASE_URL}/api/appointments/book`, {
//         doctorId: selectedDoctor,
//         date: isoDate,
//         reason
//       }, {
//         headers: { Authorization: userToken }
//       });

//       Alert.alert('Success', 'Appointment booked successfully!');
//     } catch (error) {
//       console.error(error.response?.data);
//       Alert.alert('Error', error.response?.data?.message || 'Booking failed');
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={{ padding: 20 }}>
//       <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Select Doctor</Text>
//       <Picker
//         selectedValue={selectedDoctor}
//         onValueChange={setSelectedDoctor}>
//         <Picker.Item label="Select Doctor" value="" />
//         {doctors.map(doc => (
//           <Picker.Item key={doc._id} label={doc.name} value={doc._id} />
//         ))}
//       </Picker>

//       {selectedDoctor && (
//         <>
//           <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Select Date</Text>
//           <Picker selectedValue={selectedDate} onValueChange={setSelectedDate}>
//             <Picker.Item label="Select Date" value="" />
//             {Object.keys(slots).map(date => (
//               <Picker.Item key={date} label={date} value={date} />
//             ))}
//           </Picker>

//           {selectedDate && (
//             <>
//               <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Select Time</Text>
//               <Picker selectedValue={selectedTime} onValueChange={setSelectedTime}>
//                 <Picker.Item label="Select Time" value="" />
//                 {slots[selectedDate].map(time => (
//                   <Picker.Item key={time} label={time} value={time} />
//                 ))}
//               </Picker>
//             </>
//           )}

//           <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Reason for Appointment</Text>
//           <TextInput
//             style={{
//               borderWidth: 1,
//               borderColor: '#ccc',
//               borderRadius: 5,
//               padding: 10,
//               marginVertical: 10
//             }}
//             value={reason}
//             onChangeText={setReason}
//             placeholder="Describe your reason"
//           />

//           <Button title="Book Appointment" onPress={handleBook} />
//         </>
//       )}
//     </ScrollView>
//   );
// }

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import useTheme from '../../hooks/useTheme';
import axios from 'axios';
import MyButton from '../../components/MyButton';

const PatientBookingScreen = () => {
  const { user } = useContext(AuthContext);
  const { themeStyles } = useTheme();

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  // 🔁 Load all doctors
  const fetchDoctors = async () => {
    try {
      const res = await axios.get('https://your-backend/api/users/doctors');
      setDoctors(res.data);
    } catch (err) {
      Alert.alert('Error', 'Could not load doctors');
    }
  };

  // 🔁 Load slots for selected doctor
  const fetchSlots = async (doctorId) => {
    try {
      setSelectedDoctor(doctorId);
      const res = await axios.get(`https://your-backend/api/slots/${doctorId}`);
      setSlots(res.data.slots);
    } catch (err) {
      Alert.alert('Error', 'Could not load slots');
    }
  };

  const handleBooking = async () => {
    if (!selectedDoctor || !selectedSlot || !reason.trim()) {
      return Alert.alert('Fill All Fields', 'Please select a doctor, slot, and provide a reason.');
    }

    try {
      setLoading(true);
      await axios.post(
        'https://your-backend/api/appointments/book',
        {
          doctorId: selectedDoctor,
          date: selectedSlot,
          reason,
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      Alert.alert('Success', 'Appointment booked successfully');
      setReason('');
      setSelectedSlot(null);
      setSlots([]);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <Text style={[styles.header, { color: themeStyles.text }]}>Book Appointment</Text>

      {/* Doctor Selection */}
      <Text style={[styles.label, { color: themeStyles.text }]}>Choose a Doctor:</Text>
      <FlatList
        horizontal
        data={doctors}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.doctorCard,
              selectedDoctor === item._id && { backgroundColor: themeStyles.primary },
            ]}
            onPress={() => fetchSlots(item._id)}
          >
            <Text style={{ color: themeStyles.text }}>{item.name}</Text>
            <Text style={{ fontSize: 12, color: themeStyles.icon }}>{item.specialization}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ marginBottom: 15 }}
      />

      {/* Slots */}
      {slots.length > 0 && (
        <>
          <Text style={[styles.label, { color: themeStyles.text }]}>Available Slots:</Text>
          <FlatList
            horizontal
            data={slots}
            keyExtractor={(item) => item.date}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.slot,
                  selectedSlot === item.date && { backgroundColor: themeStyles.primary },
                ]}
                onPress={() => setSelectedSlot(item.date)}
              >
                <Text style={{ color: themeStyles.text }}>
                  {new Date(item.date).toLocaleString()}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ marginBottom: 15 }}
          />
        </>
      )}

      {/* Reason */}
      <TextInput
        style={[styles.input, { backgroundColor: themeStyles.card, color: themeStyles.text }]}
        placeholder="Reason for visit"
        placeholderTextColor={themeStyles.icon}
        value={reason}
        onChangeText={setReason}
        multiline
      />

      <MyButton title="Book Appointment" onPress={handleBooking} disabled={loading} />

      {loading && <ActivityIndicator style={{ marginTop: 10 }} color={themeStyles.primary} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  label: { fontSize: 16, marginBottom: 5 },
  doctorCard: {
    padding: 10,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  slot: {
    padding: 10,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    minHeight: 60,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
});

export default PatientBookingScreen;
