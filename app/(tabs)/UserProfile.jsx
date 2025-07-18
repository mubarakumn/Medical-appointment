import React, { useContext, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Image,
  TouchableOpacity, ActivityIndicator, Alert, ScrollView
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import useTheme from '../../hooks/useTheme';
import TopBar from '../../components/TopBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';

const PatientProfileScreen = () => {
  const { userDetails, logout } = useContext(AuthContext);
  const { themeStyles } = useTheme();
  const router = useRouter();

  const [formData, setFormData] = useState({
    phone: userDetails.phone || '',
    address: userDetails.address || '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    if (!formData.phone || !formData.address) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const token = await AsyncStorage.getItem('token');

    try {
      await axios.patch(
        `https://medical-appointment-backend-five.vercel.app/api/users/update`,
        {
          phone: formData.phone,
          address: formData.address,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/Login');
  };

  return (
    <ScrollView style={{ backgroundColor: themeStyles.background }} contentContainerStyle={styles.scrollContainer}>
      <TopBar title="Patient Profile" />

      <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: userDetails.image || 'https://www.pngmart.com/files/23/Profile-PNG-Photo.png',
            }}
            style={styles.avatar}
          />
        </View>

        <Text style={[styles.name, { color: themeStyles.text }]}>{userDetails.name}</Text>
        <Text style={[styles.info, { color: themeStyles.icon }]}>Email: {userDetails.email}</Text>

        <TextInput
          style={[styles.input, { color: themeStyles.text, borderColor: themeStyles.border }]}
          placeholder="Phone"
          value={formData.phone}
          onChangeText={(text) => handleChange('phone', text)}
          keyboardType="phone-pad"
          placeholderTextColor={themeStyles.icon}
        />

        <TextInput
          style={[styles.input, { color: themeStyles.text, borderColor: themeStyles.border }]}
          placeholder="Address"
          value={formData.address}
          onChangeText={(text) => handleChange('address', text)}
          placeholderTextColor={themeStyles.icon}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: themeStyles.primary }]}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Update Profile</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'red', marginTop: 10 }]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default PatientProfileScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  info: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 15,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
