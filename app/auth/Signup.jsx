import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AuthContext } from '../../context/AuthContext';
import useTheme from '../../hooks/useTheme';

const Signup = () => {
  const { register } = useContext(AuthContext);
  const router = useRouter();
  const { themeStyles, theme } = useTheme();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    dateOfBirth: new Date(),
    gender: 'male',
    address: '',
    role: 'patient',
    specialization: '',
    experience: ''
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSignup = async () => {
    const {
      name, email, phone, password, dateOfBirth,
      gender, address, role, specialization, experience
    } = form;

    if (!name || !email || !phone || !password || !dateOfBirth || !gender || !address) {
      return Alert.alert('Error', 'Please fill all required fields');
    }

    if (role === 'doctor' && (!specialization || !experience)) {
      return Alert.alert('Error', 'Doctor fields required');
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        dateOfBirth: new Date(dateOfBirth).toISOString(),
      };
      if (role !== 'doctor') {
        delete payload.specialization;
        delete payload.experience;
      }

      await register(payload);
    } catch (error) {
      Alert.alert('Registration failed', error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <Text style={[styles.title, { color: themeStyles.text }]}>Sign Up</Text>

      {/* Input Fields */}
      {['name', 'email', 'phone', 'password', 'address'].map(field => (
        <TextInput
          key={field}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={form[field]}
          onChangeText={(value) => handleChange(field, value)}
          placeholderTextColor={themeStyles.icon}
          secureTextEntry={field === 'password'}
          keyboardType={field === 'phone' ? 'phone-pad' : 'default'}
          style={[styles.input, { backgroundColor: themeStyles.card, color: themeStyles.text }]}
        />
      ))}

      {/* Gender */}
      <View style={styles.genderContainer}>
        {['male', 'female', 'other'].map(option => (
          <TouchableOpacity
            key={option}
            onPress={() => handleChange('gender', option)}
            style={[
              styles.genderOption,
              form.gender === option && { backgroundColor: themeStyles.primary }
            ]}
          >
            <Text style={{ color: form.gender === option ? 'white' : themeStyles.text }}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Date Picker */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateBtn}>
        <Text style={{ color: themeStyles.text }}>
          Date of Birth: {new Date(form.dateOfBirth).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={new Date(form.dateOfBirth)}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) handleChange('dateOfBirth', selectedDate);
          }}
        />
      )}

      {/* Role Picker */}
      <View style={styles.roleContainer}>
        {['patient', 'doctor'].map(role => (
          <TouchableOpacity
            key={role}
            onPress={() => handleChange('role', role)}
            style={[
              styles.genderOption,
              form.role === role && { backgroundColor: themeStyles.primary }
            ]}
          >
            <Text style={{ color: form.role === role ? 'white' : themeStyles.text }}>
              {role}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Doctor Fields */}
      {form.role === 'doctor' && (
        <>
          <TextInput
            placeholder="Specialization"
            value={form.specialization}
            onChangeText={value => handleChange('specialization', value)}
            placeholderTextColor={themeStyles.icon}
            style={[styles.input, { backgroundColor: themeStyles.card, color: themeStyles.text }]}
          />
          <TextInput
            placeholder="Experience (years)"
            value={form.experience}
            onChangeText={value => handleChange('experience', value)}
            placeholderTextColor={themeStyles.icon}
            keyboardType="numeric"
            style={[styles.input, { backgroundColor: themeStyles.card, color: themeStyles.text }]}
          />
        </>
      )}

      {/* Submit */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: themeStyles.text }]}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={themeStyles.background} />
        ) : (
          <Text style={[styles.buttonText, { color: themeStyles.background }]}>Register</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/auth/Login')}>
        <Text style={[styles.link, { color: themeStyles.primary }]}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, alignSelf: 'center' },
  input: { height: 50, borderRadius: 10, paddingHorizontal: 15, marginBottom: 15 },
  button: { height: 50, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  buttonText: { fontSize: 16, fontWeight: 'bold' },
  link: { fontSize: 16, marginTop: 20, textAlign: 'center' },
  genderContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  roleContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  genderOption: { padding: 10, borderRadius: 10 },
  dateBtn: { marginVertical: 10, padding: 12, backgroundColor: '#ccc', borderRadius: 10 },
});

export default Signup;
