import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import useTheme from '../../hooks/useTheme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import TopBar from '../../components/TopBar';

export default function DoctorScreen() {
  const { themeStyles } = useTheme();
  const { doctorId } = useLocalSearchParams();
  const [doctorDetails, setDoctorDetails] = useState(null);
  const router = useRouter();

  const handleBookAppointment = () => {
    router.push({
      pathname: '/screens/BookAppointment',
      params: { doctorId: doctorDetails._id }
    });
  };

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`https://medical-appointment-backend-five.vercel.app/api/users/${doctorId}`);
        if (response.status === 200) {
          setDoctorDetails(response.data);
        } else {
          Alert.alert('Error', 'Doctor not found');
          router.replace('/');
        }
      } catch (error) {
        console.error('Error fetching Doctor details:', error.message);
        Alert.alert('Error', 'Could not fetch Doctor details');
        router.replace('/');
      }
    };

    if (doctorId) fetchDoctor();
    else router.replace('/');
  }, []);

  if (!doctorDetails) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: themeStyles.background }]}>
        <Text style={{ color: themeStyles.text }}>Loading doctor details...</Text>
      </View>
    );
  }

  const renderAvailability = ({ item }) => (
    <View style={[styles.availabilityItem, { backgroundColor: themeStyles.card }]}>
      <Text style={[styles.availabilityText, { color: themeStyles.text }]}>{item.day}</Text>
      <Text style={[styles.availabilityText, { color: themeStyles.text }]}>
        {item.startTime} - {item.endTime}
      </Text>
      <Text style={[styles.availabilityText, { color: themeStyles.icon }]}>
        Duration: {item.duration} mins
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <TopBar title="Doctor Profile" />

      <View style={styles.profileContainer}>
        <Image
          source={{ uri: doctorDetails.profileImage || 'https://www.pngmart.com/files/23/Profile-PNG-Photo.png' }}
          style={styles.image}
        />

        <View style={[styles.detailsContainer, { backgroundColor: themeStyles.card }]}>
          <View style={styles.nameRow}>
            <View style={styles.nameInfo}>
              <Text style={[styles.name, { color: themeStyles.text }]}>{doctorDetails.name}</Text>
              <Text style={[styles.specialty, { color: themeStyles.icon }]}>{doctorDetails.specialization}</Text>
            </View>
            <View style={styles.metaInfo}>
              <Text style={[styles.metaText, { color: themeStyles.text }]}>{doctorDetails.gender}</Text>
              <Text style={[styles.metaText, { color: themeStyles.text }]}>
                {doctorDetails.experience} yrs
              </Text>
            </View>
          </View>

          <View style={styles.additionalDetails}>
            <Text style={[styles.label, { color: themeStyles.text }]}>About</Text>
            <Text style={[styles.description, { color: themeStyles.text }]}>
              {doctorDetails.about?.trim()
                ? doctorDetails.about
                : `Dr. ${doctorDetails.name} is a highly qualified professional with experience in ${doctorDetails.specialization}.`}
            </Text>
          </View>
        </View>

        <View style={[styles.availabilitySection, { backgroundColor: themeStyles.background }]}>
          <Text style={[styles.label, { color: themeStyles.text, marginBottom: 10 }]}>Availability</Text>
          {doctorDetails.availability && doctorDetails.availability.length > 0 ? (
            <FlatList
              data={doctorDetails.availability}
              keyExtractor={(item, index) => `${item.day}-${index}`}
              renderItem={renderAvailability}
              scrollEnabled={false}
            />
          ) : (
            <Text style={{ color: themeStyles.icon }}>Not Available</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: themeStyles.primary }]}
          onPress={handleBookAppointment}
        >
          <Text style={[styles.buttonText, { color: themeStyles.background }]}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 15,
  },
  detailsContainer: {
    width: '100%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameInfo: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  specialty: {
    fontSize: 16,
    marginTop: 2,
  },
  metaInfo: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 14,
    marginVertical: 2,
  },
  additionalDetails: {
    marginTop: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  availabilitySection: {
    width: '100%',
    marginBottom: 20,
  },
  availabilityItem: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  availabilityText: {
    fontSize: 14,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
