import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Image, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Replace useRouter with useNavigation
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import useTheme from '../../hooks/useTheme'; // Import the useTheme hook
import { AuthContext } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const categories = [
    { id: '1', image: "https://www.pngmart.com/files/23/Profile-PNG-Photo.png", category: 'Cardiology' },
    { id: '2', image: "https://www.pngmart.com/files/23/Profile-PNG-Photo.png", category: 'Neurology' },
    { id: '3', image: "https://www.pngmart.com/files/23/Profile-PNG-Photo.png", category: 'Odontology' },
    { id: '4', image: "https://www.pngmart.com/files/23/Profile-PNG-Photo.png", category: 'Cardiology' },
];

const HomeScreen = () => {
    const navigation = useNavigation(); // Replace useRouter with useNavigation
    const { themeStyles, theme } = useTheme(); // Destructure themeStyles and theme from useTheme
    const { userDetails } = useContext(AuthContext);
    const [doctors, setDoctors] = useState([]);


    // get doctors 
    useEffect(() => {
        const getDoctors = async () => {
            try {
                const res = await axios.get('http://192.168.43.153:3000/api/users/doctors');
                const data = res.data
                setDoctors(data);
            } catch (error) {
                console.log(error.message);
            }
        }
        getDoctors();

        return () => {
            setDoctors([]);
        }
    }, [])



    // Navigate to the login screen
    const handleProfile = () => {
        navigation.navigate('UserProfile'); // Navigate to the UserProfile screen
    };

    // Navigate to the booking screen (assuming you have a booking screen set up)
    const handleDoctorProfile = (doctorId) => {
        navigation.navigate('screens/DoctorScreen', { doctorId }); // Navigate to the DoctorScreen
    };

    // Navigate to the search screen
    const handleSearch = () => {
        navigation.navigate('screens/DoctorScreen'); // Navigate to the DoctorScreen
    }

    // Navigate to the menu screen
    const handleNotification = () => {
        navigation.navigate('screens/Notifications'); // Navigate to the Notifications screen
    }

    return (
        <View style={[styles.container, { backgroundColor: themeStyles.card }]}>
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={themeStyles.card} />
            {/* User Nav */}
            <View style={styles.nav}>
                {/* profile nav */}
                <TouchableOpacity onPress={handleProfile}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <FontAwesome5 name="user-circle" size={30} color={themeStyles.text} />
                        <View>
                            <Text style={[styles.navText, { color: themeStyles.text }]}>Welcome back!</Text>
                            <Text style={[styles.navText, { fontWeight: 'bold', color: themeStyles.text }]}>{userDetails.name || 'Guest'} 🤗 </Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* nav icon */}
                <TouchableOpacity onPress={handleNotification}>
                    <MaterialIcons name="notifications" size={30} color={themeStyles.text} />
                </TouchableOpacity>
            </View>

            {/* search section */}
            <View style={[styles.searchSection, { backgroundColor: themeStyles.background }]}>
                <TextInput
                    placeholder="Search for a doctor"
                    placeholderTextColor={themeStyles.text}
                    style={[styles.searchInput, { color: themeStyles.text, backgroundColor: themeStyles.card, placeholder: themeStyles.text }]} />

                <TouchableOpacity
                    onPress={handleSearch}
                    style={[styles.searchIcon, { backgroundColor: themeStyles.secondary }]}>
                    <MaterialIcons
                        name="search" size={24} color={themeStyles.card}
                    />
                </TouchableOpacity>
            </View>

            {/* Services Or categories */}
            <View>
                <Text style={[styles.subtitle, { color: themeStyles.text }]}>Services</Text>
                {/* Services container */}
                <FlatList
                    data={categories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={[styles.categoryCard, { backgroundColor: themeStyles.secondary }]}>
                            <Image source={{ uri: item.image }} style={styles.categoryCardImg} />
                            <Text style={[styles.categoryCardText, { color: themeStyles.background }]}>{item.category}</Text>
                        </View>
                    )}
                />
            </View>

            {/* List of Doctors */}
            <Text style={[styles.subtitle, { color: themeStyles.text }]}>List of Doctors</Text>
            {doctors.length === 0 ? (
                <Text style={[styles.subtitle, { color: themeStyles.text }]}>No Doctors Available</Text>
            ) : (
                <FlatList
                    data={doctors}
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={[styles.DoctorCard, { backgroundColor: themeStyles.background, borderColor: themeStyles.border }]} onPress={() => handleDoctorProfile(item._id)}>
                            <Image source={{ uri: item.image || 'https://avatar.iran.liara.run/public' }} style={styles.DoctorCardImg} />
                            <View style={styles.DoctorCardDetails}>
                                <View style={styles.DoctorCardDetails}>
                                    <Text style={[styles.DoctorName, { color: themeStyles.secondary }]}>{item.name}</Text>
                                    <Text style={[styles.DoctorDescription, { color: themeStyles.text }]}>{item.specialization}</Text>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'start', alignItems: 'center' }}>
                                        <Text style={[styles.DoctorDescription, { color: themeStyles.text }]}>{item.gender} .</Text>
                                        <Text style={[styles.DoctorDescription, { color: themeStyles.text }]}> {item.experience} years</Text>
                                    </View>
                                    {/* <Text style={[styles.DoctorCardText, { color: themeStyles.text }]}>View Profile</Text> */}
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

export default HomeScreen; // Ensure this is a default export

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    nav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    navText: {
        color: '#000',
    },
    searchSection: {
        width: '100%',
        height: 45,
        padding: 3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f6f6f6',
        overflow: 'hidden',
        borderRadius: 20,
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    },
    searchInput: {
        flex: 1,
        width: '100%',
        height: '100%',
        padding: 10,
        borderRadius: 20,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        justifyContent: 'center',
    },
    searchIcon: {
        height: '100%',
        padding: 5,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    categoryCard: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        marginRight: 10,
        boxShadow: '0 0 10px rgba(0, 183, 255, 0.3)',
    },
    categoryCardImg: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginBottom: 10,
    },
    categoryCardText: {
        color: '#000',
    },
    DoctorCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 8,
        boxShadow: '0 0 2px rgba(0,0,0,0.2)',
    },
    DoctorCardImg: {
        width: '40%',
        height: 100,
        borderRadius: 5,
        marginRight: 10,
    },
    DoctorCardDetails: {
        flex: 1,
        marginRight: 5,
    },
    DoctorName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    DoctorDescription: {
        marginBottom: 10,
    },
    DoctorCardText: {
        fontSize: 15
    }
});
