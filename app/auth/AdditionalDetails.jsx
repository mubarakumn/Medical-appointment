import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import DatePicker from 'react-native-date-picker';
import MyButton from '../../components/MyButton';
import useTheme from '../../hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';

const AdditionalDetails = () => {
    const { themeStyles } = useTheme();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const data = useLocalSearchParams();
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');

    const handleSubmit = async() => {
        if (!name.trim() || !phone.trim() || !gender.trim() || !address.trim()) {
            Alert.alert('Error', 'Please fill in all the fields.');
            return;
        }

        const email = data.email;
        const password = data.password;

        const userDetails = {
            name,
            email,
            password,
            phone,
            dateOfBirth: dateOfBirth.toDateString(),
            gender,
            address,
        };

        // console.log('User Details:', userDetails);

        try {
            const response = await axios.post('http://192.168.43.153:3000/api/users/register', {
              ...userDetails
            });
          
            if (response.status === 200) {
              // Check if the response data contains the expected structure
              if (response.data) {
                // Navigate to the login screen
                navigation.navigate('auth/Login'); 
                return;
              } 
            } else { 
              Alert.alert('Error', response.data.message || 'Sign-up failed'); // Provide feedback on failure
              return; 
            }
          } catch (error) {
            // Check if error.response exists
            console.log(error.message);
            if (error.response) {
              // The request was made and the server responded with a status code
              if (error.response.status === 500) {
                console.log("message:::",response.message);
                Alert.alert('Oops!', error.response.message);
              } else {
                Alert.alert('Error', error.response.data.message || 'An error occurred during login. Please try again.'); // User-friendly error message
              }
            } else {
              // The request was made but no response was received
              Alert.alert('Error', 'Network error. Please check your connection and try again.');
            }
          }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: themeStyles.background }]}>
            <Text style={[styles.title, { color: themeStyles.text }]}>Additional Details</Text>

            {/* Name Input */}
            <View style={styles.section}>
                <Text style={[styles.label, { color: themeStyles.text }]}>Name:</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: themeStyles.card, color: themeStyles.text }]}
                    placeholder="Enter your name"
                    placeholderTextColor={themeStyles.icon}
                    value={name}
                    onChangeText={setName}
                />
            </View>

            {/* Phone Input */}
            <View style={styles.section}>
                <Text style={[styles.label, { color: themeStyles.text }]}>Phone:</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: themeStyles.card, color: themeStyles.text }]}
                    placeholder="Enter your phone number"
                    placeholderTextColor={themeStyles.icon}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />
            </View>

            {/* Date of Birth Picker */}
            <View style={styles.section}>
                <Text style={[styles.label, { color: themeStyles.text }]}>Date of Birth:</Text>
                <MyButton
                    title={dateOfBirth.toDateString()}
                    onPress={() => setIsDatePickerOpen(true)}
                />
                <DatePicker
                    modal
                    open={isDatePickerOpen}
                    date={dateOfBirth}
                    mode="date"
                    onConfirm={(date) => {
                        setIsDatePickerOpen(false);
                        setDateOfBirth(date);
                    }}
                    onCancel={() => setIsDatePickerOpen(false)}
                />
            </View>

            {/* Gender Input */}
            <View style={styles.section}>
                <Text style={[styles.label, { color: themeStyles.text }]}>Gender:</Text>
                <View style={styles.genderContainer}>
                    <MyButton
                        title="male"
                        onPress={() => setGender('male')}
                        style={[
                            styles.genderButton,
                            gender === 'male' && { backgroundColor: themeStyles.primary },
                        ]}
                    />
                    <MyButton
                        title="female"
                        onPress={() => setGender('female')}
                        style={[
                            styles.genderButton,
                            gender === 'female' && { backgroundColor: themeStyles.primary },
                        ]}
                    />
                </View>
            </View>

            {/* Address Input */}
            <View style={styles.section}>
                <Text style={[styles.label, { color: themeStyles.text }]}>Address:</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: themeStyles.card, color: themeStyles.text }]}
                    placeholder="Enter your address"
                    placeholderTextColor={themeStyles.icon}
                    value={address}
                    onChangeText={setAddress}
                    multiline
                />
            </View>

            {/* Sign-up3 Button */}
            <MyButton title="Sign-up" onPress={handleSubmit} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    input: {
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    genderButton: {
        flex: 1,
        marginHorizontal: 5,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
});

export default AdditionalDetails;