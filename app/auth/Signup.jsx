import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import DatePicker from 'react-native-date-picker';
import MyButton from '../../components/MyButton';
import useTheme from '../../hooks/useTheme';
import { useRouter } from 'expo-router';
import { AuthContext } from '../../context/AuthContext';

const SignupSteps = () => {
  const { themeStyles } = useTheme();
  const router = useRouter();
  const { register } = useContext(AuthContext);

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [role, setRole] = useState('patient');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');

  const nextStep = () => {
    if (step === 1 && (!email || !password || password !== confirmPassword)) {
      return Alert.alert('Error', 'Please enter valid email & matching passwords.');
    }
    if (step === 2 && (!name || !phone || !gender || !address)) {
      return Alert.alert('Error', 'Please fill all personal details.');
    }
    if (step === 4 && role === 'doctor' && (!specialization || !experience)) {
      return Alert.alert('Error', 'Please fill in your specialization and experience.');
    }
    setStep(prev => prev + 1);
  };

  const handleSignup = async () => {
    const payload = {
      name,
      email,
      password,
      phone,
      gender,
      address,
      dateOfBirth: dateOfBirth.toISOString(),
      role,
      ...(role === 'doctor' && { specialization, experience: Number(experience) })
    };

    try {
      await register(payload);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Signup failed');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Text style={[styles.title, { color: themeStyles.text }]}>Step 1: Account</Text>
            <TextInput style={[styles.input, { backgroundColor: themeStyles.card, color: themeStyles.text }]} placeholder="Email" placeholderTextColor={themeStyles.icon} value={email} onChangeText={setEmail} autoCapitalize="none" />
            <TextInput style={[styles.input, { backgroundColor: themeStyles.card, color: themeStyles.text }]} placeholder="Password" placeholderTextColor={themeStyles.icon} value={password} onChangeText={setPassword} secureTextEntry />
            <TextInput style={[styles.input, { backgroundColor: themeStyles.card, color: themeStyles.text }]} placeholder="Confirm Password" placeholderTextColor={themeStyles.icon} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
          </>
        );

      case 2:
        return (
          <>
            <Text style={[styles.title, { color: themeStyles.text }]}>Step 2: Personal Info</Text>
            <TextInput style={[styles.input, { backgroundColor: themeStyles.card, color: themeStyles.text }]} placeholder="Full Name" placeholderTextColor={themeStyles.icon} value={name} onChangeText={setName} />
            <TextInput style={[styles.input, { backgroundColor: themeStyles.card, color: themeStyles.text }]} placeholder="Phone" placeholderTextColor={themeStyles.icon} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <TextInput style={[styles.input, { backgroundColor: themeStyles.card, color: themeStyles.text }]} placeholder="Gender" placeholderTextColor={themeStyles.icon} value={gender} onChangeText={setGender} />
            <TextInput style={[styles.input, { backgroundColor: themeStyles.card, color: themeStyles.text }]} placeholder="Address" placeholderTextColor={themeStyles.icon} value={address} onChangeText={setAddress} multiline />
            <MyButton title={dateOfBirth.toDateString()} onPress={() => setIsDatePickerOpen(true)} />
            <DatePicker modal mode="date" open={isDatePickerOpen} date={dateOfBirth} onConfirm={(date) => { setIsDatePickerOpen(false); setDateOfBirth(date); }} onCancel={() => setIsDatePickerOpen(false)} />
          </>
        );

      case 3:
        return (
          <>
            <Text style={[styles.title, { color: themeStyles.text }]}>Step 3: Choose Role</Text>
            <View style={styles.roleContainer}>
              <MyButton title="Patient" onPress={() => setRole('patient')} style={[styles.roleBtn, role === 'patient' && styles.selected]} />
              <MyButton title="Doctor" onPress={() => setRole('doctor')} style={[styles.roleBtn, role === 'doctor' && styles.selected]} />
            </View>
          </>
        );

      case 4:
        if (role === 'doctor') {
          return (
            <>
              <Text style={[styles.title, { color: themeStyles.text }]}>Step 4: Doctor Info</Text>
              <TextInput style={[styles.input, { backgroundColor: themeStyles.card, color: themeStyles.text }]} placeholder="Specialization" placeholderTextColor={themeStyles.icon} value={specialization} onChangeText={setSpecialization} />
              <TextInput style={[styles.input, { backgroundColor: themeStyles.card, color: themeStyles.text }]} placeholder="Experience (years)" placeholderTextColor={themeStyles.icon} value={experience} onChangeText={setExperience} keyboardType="numeric" />
            </>
          );
        } else {
          handleSignup(); // For patient, auto submit here
        }
        break;

      default:
        return null;
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: themeStyles.background }]}>
      <View style={styles.centered}>
        {renderStep()}
        {(step < 4 || (step === 4 && role === 'doctor')) && <MyButton title="Next" onPress={nextStep} />}
        {step === 4 && role !== 'doctor' && <MyButton title="Finish Signup" onPress={handleSignup} />}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginTop: 20,
  },
  roleBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
  selected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
});

export default SignupSteps;
