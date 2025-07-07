import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import useTheme from '../../hooks/useTheme';
import TopBar from '../../components/TopBar'


const DoctorProfileScreen = () => {
  const { userDetails } = useContext(AuthContext); // doctor info
  const { themeStyles } = useTheme();

  if (!userDetails || userDetails.role !== 'doctor') {
    return (
      <View style={[styles.center, { backgroundColor: themeStyles.background }]}>
        <Text style={{ color: themeStyles.text }}>Access denied. Only doctors can view this page.</Text>
      </View>
    );
  }

  return (
    <View >
      <TopBar 
      title={"Profile"}
      />
      <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/300?doctor' }}
            style={styles.avatar}
          />
        </View>
        <Text style={[styles.name, { color: themeStyles.text }]}>{userDetails.name}</Text>
        <Text style={[styles.info, { color: themeStyles.icon }]}>Email: {userDetails.email}</Text>
        <Text style={[styles.info, { color: themeStyles.icon }]}>Specialization: {userDetails.Specialization}</Text>
        <Text style={[styles.info, { color: themeStyles.icon }]}>Experience: {userDetails.experience} years</Text>
        <Text style={[styles.info, { color: themeStyles.icon }]}>Phone: {userDetails.phone}</Text>
        <Text style={[styles.info, { color: themeStyles.icon }]}>Address: {userDetails.address}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
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
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DoctorProfileScreen;
