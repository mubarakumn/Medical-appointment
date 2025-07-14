import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, FlatList,
  TouchableOpacity, Alert, StyleSheet
} from 'react-native';
import axios from 'axios';
import useTheme from '../../hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const { themeStyles } = useTheme();

  const fetchPatients = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get('https://medical-appointment-backend-five.vercel.app/api/users/patients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(res.data);
    } catch (err) {
      Alert.alert('Error', 'Could not load patients');
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Confirm', 'Delete this patient?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`https://medical-appointment-backend-five.vercel.app/api/admin/users/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            fetchPatients(); // Refresh after delete
          } catch {
            Alert.alert('Error', 'Failed to delete patient');
          }
        }
      }
    ]);
  };

  useEffect(() => { fetchPatients(); }, []);

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={themeStyles.background} />
      <Text style={[styles.header, { color: themeStyles.text }]}>Patients</Text>

      <TextInput
        style={[styles.input, { borderColor: themeStyles.border, color: themeStyles.text }]}
        placeholder="Search by name"
        placeholderTextColor={themeStyles.icon}
        value={search}
        onChangeText={setSearch}
      />

      {filtered.length === 0 ? (
        <Text style={{ color: themeStyles.icon, textAlign: 'center', marginTop: 30 }}>
          No patients found.
        </Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <View style={[styles.card, { borderColor: themeStyles.border }]}>
              <Text style={[styles.name, { color: themeStyles.text }]}>{item.name}</Text>
              <Text style={{ color: themeStyles.icon }}>{item.email}</Text>
              <Text style={{ color: themeStyles.icon }}>
                Appointments: {item.totalAppointments ?? 0}
              </Text>
              <TouchableOpacity onPress={() => handleDelete(item._id)}>
                <Text style={{ color: 'red', marginTop: 5 }}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Patients;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  card: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
