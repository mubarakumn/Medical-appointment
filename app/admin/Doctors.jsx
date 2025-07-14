import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, TextInput, Alert
} from 'react-native';
import axios from 'axios';
import useTheme from '../../hooks/useTheme';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const { themeStyles } = useTheme();
  const router = useRouter();

  const fetchDoctors = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get('https://medical-appointment-backend-five.vercel.app/api/users/doctors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(res.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load doctors');
    }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleDelete = async (id) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to remove this doctor?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`https://medical-appointment-backend-five.vercel.app/api/admin/users/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            fetchDoctors();
          } catch (err) {
            Alert.alert('Error', 'Failed to delete doctor');
          }
        }
      }
    ]);
  };

  const filteredDoctors = doctors.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <Text style={[styles.header, { color: themeStyles.text }]}>Doctors</Text>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search doctor..."
          placeholderTextColor={themeStyles.icon}
          style={[styles.searchInput, { color: themeStyles.text, borderColor: themeStyles.border }]}
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: themeStyles.primary }]}
          onPress={() => router.push('/Admin/AddDoctor')}
        >
          <Text style={styles.addButtonText}>+ Add Doctor</Text>
        </TouchableOpacity>
      </View>

      {filteredDoctors.length === 0 ? (
        <Text style={{ color: themeStyles.text, textAlign: 'center', marginTop: 50 }}>
          No doctors found.
        </Text>
      ) : (
        <FlatList
          data={filteredDoctors}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={[styles.card, { borderColor: themeStyles.border }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.name, { color: themeStyles.text }]}>{item.name}</Text>
                <Text style={[styles.specialization, { color: themeStyles.icon }]}>
                  {item.specialization || 'N/A'}
                </Text>
              </View>
              <Text style={[styles.meta, { color: themeStyles.icon }]}>
                Appointments: {item.totalAppointments ?? 0}
              </Text>
              <Text style={[styles.meta, { color: themeStyles.icon }]}>
                Slots: {item.availableSlots?.length ?? 0}
              </Text>

              <View style={styles.actions}>
                <TouchableOpacity onPress={() => router.push(`/Admin/EditDoctor/${item._id}`)}>
                  <Text style={[styles.actionText, { color: themeStyles.primary }]}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item._id)}>
                  <Text style={[styles.actionText, { color: 'red' }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Doctors;

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
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  addButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  specialization: {
    fontStyle: 'italic',
  },
  meta: {
    marginTop: 5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 20,
  },
  actionText: {
    fontWeight: 'bold',
  },
});
