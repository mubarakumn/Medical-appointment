import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import useTheme from '../../hooks/useTheme';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import TopBar from '../../components/TopBar';

export default function DoctorScreen() {
  const { themeStyles } = useTheme();
  const { doctorId } = useLocalSearchParams();
  const [doctorDetails, setDoctorDetails] = useState({})
  const navigation = useRouter();

  // console.log("doctor profile", JSON.stringify(doctorDetails, null, 2));

  const handleGoback = () => {
    navigation.navigate('/');
  }

  const handleBookAppointment = (doctorData) => {
    navigation.navigate({
      pathname: 'screens/BookAppointment',
      params: doctorData
    });
  }


  useEffect(() => {
    // Check if doctor's id is valid and fetch details
    if (doctorId) {
      const fetchDoctor = async (doctorId) => {
        try {
          // setLoading(true);
          const response = await axios.get(`https://medicalapp-backend.vercel.app/api/users/${doctorId}`);
          if (response.status === 200) {
            setDoctorDetails(response.data);
          } else {
            Alert.alert('Error', 'Doctor not found');
          }
        } catch (error) {
          console.error('Error fetching Doctor details:', error.message);
          Alert.alert('Error', 'Could not fetch Doctor details');
        }
      };
      fetchDoctor(doctorId);
    } else {
      navigation.push('/');
    }
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <TopBar
      title={"Doctor Profile"}
      />

      <View style={styles.profileContainer}>
        <Image source={{ uri: 'https://www.pngmart.com/files/23/Profile-PNG-Photo.png' }} style={styles.image} />
        <View style={[styles.detailsContainer, { backgroundColor: themeStyles.card }]}>
          <View style={{ flexDirection:'row',alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={[styles.name, { color: themeStyles.text }]}>{doctorDetails.name}</Text>
              <Text style={[styles.specialty, { color: themeStyles.text }]}>{doctorDetails.specialization}</Text>
            </View>
            <View style={{display: 'flex', flexDirection:'column', justifyContent: 'space-between' }}>
              <Text style={[styles.specialty, { color: themeStyles.text, marginVertical: 10 }]}>{doctorDetails.gender}</Text>
              <Text style={[styles.specialty, { color: themeStyles.text }]}>{doctorDetails.experience} years</Text>
            </View>
          </View>
          <View style={styles.additionalDetails}>
            <Text style={[styles.label, { color: themeStyles.text }]}>About me</Text>
            <Text style={[styles.text, { color: themeStyles.text }]}> Dr. John Doe is a highly experienced cardiologist with over 20 years of experience in the field. 
          He specializes in treating heart conditions and providing comprehensive cardiac care.</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.button, { backgroundColor: themeStyles.text }]} onPress={()=>handleBookAppointment(doctorDetails)}>
          <Text style={[styles.buttonText, { color: themeStyles.background }]}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 20,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    marginVertical: 20,
    // borderWidth: 2,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    // borderWidth:2,
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  specialty: {
    // borderWidth:2,
    // width: '100%',
    fontSize: 16,
    color: '#666',
  },
  doctorStatus: {
    margin: 10,
  },
  statusCard: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    boxShadow: '0 0 10px rgba(0, 183, 255, 0.3)',
  },
  detailsContainer: { 
    width: '100%', 
    marginTop:25, 
    justifyContent: 'start', 
    padding:10,
    borderRadius: 10,
  },
  additionalDetails: {
    marginTop: 10,
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
})