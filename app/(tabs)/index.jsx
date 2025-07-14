import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Image, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
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
    const { themeStyles, theme } = useTheme(); // Destructure themeStyles and theme from useTheme
    const { userDetails } = useContext(AuthContext);
    const [doctors, setDoctors] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [appointments, setAppointments] = useState([]);


    const router = useRouter();

    // get doctors /
    // http://192.168.43.153:3000

    const getDoctors = async () => {
        try {
            setRefreshing(true); // Start refresh spinner
            const res = await axios.get('https://medical-appointment-backend-five.vercel.app/api/users/doctors');
            setDoctors(res.data);
        } catch (error) {
            console.log('Error fetching doctors:', error.message);
        } finally {
            setRefreshing(false); // Stop refresh spinner
        }
    };

    useEffect(() => {
        getDoctors();
    }, [])



    const fetchAppointments = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const res = await axios.get('https://medical-appointment-backend-five.vercel.app/api/appointments/my', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(res.data || []);
        } catch (error) {
            console.error('Failed to fetch appointments:', error.message);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);


    const StatCard = ({ value, label, icon }) => (
        <View style={[styles.statCard, { backgroundColor: themeStyles.background }]}>
            <Text style={styles.statIcon}>{icon}</Text>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );

    // Navigate to the login screen
    const handleProfile = () => {
        router.push('UserProfile'); // Navigate to the UserProfile screen
    };

    // Navigate to the booking screen (assuming you have a booking screen set up)
    const handleDoctorProfile = (doctorId) => {
        console.log(doctorId);
        router.push(`/screens/${doctorId}`);
    };

    // Navigate to the search screen
    const handleSearch = () => {
        router.push('screens/DoctorScreen'); // Navigate to the DoctorScreen
    }

    // Navigate to the menu screen
    const handleNotification = () => {
        router.push('screens/Notifications'); // Navigate to the Notifications screen
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

            <View style={{ marginTop: 20 }}>
                <Text style={[styles.subtitle, { color: themeStyles.text }]}>Your Dashboard</Text>

                {/* Stat Cards */}
                <View>
                    {/* <Text style={[styles.subtitle, { color: themeStyles.text }]}>Your Stats</Text> */}
                    <View style={styles.cardsRow}>
                        <StatCard value={appointments.length} label="Appointments" icon="📅" />
                        <StatCard value="—" label="Upcoming" icon="🕒" />
                        <StatCard value="—" label="Prescriptions" icon="💊" />
                    </View>
                </View>

                {/* View Appointment History */}
                {/* <TouchableOpacity
                    style={[styles.dashboardCard, { backgroundColor: themeStyles.secondary, marginTop: 20 }]}
                    onPress={() => router.push('screens/AppointmentHistory')}
                >
                    <Text style={[styles.dashboardCardText, { color: themeStyles.card }]}>
                        📖 View Appointment History
                    </Text>
                </TouchableOpacity> */}
            </View>


            {/* Categories */}
            {/* <View>
                <Text style={[styles.subtitle, { color: themeStyles.text }]}>Catergories</Text>
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
            </View> */}

            {/* Doctors */}
            {doctors.length === 0 ? (
                <Text style={[styles.subtitle, { color: themeStyles.text }]}>No doctors available</Text>
            ) : (
                <>
                    <Text style={[styles.subtitle, { color: themeStyles.text }]}>Doctors</Text>
                    <FlatList
                        data={doctors}
                        initialNumToRender={5}
                        refreshing={refreshing} // ✅ this controls pull-to-refresh spinner
                        onRefresh={getDoctors} // ✅ called when pulled
                        keyExtractor={(item) => item._id}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={[styles.DoctorCard, { backgroundColor: themeStyles.background, borderColor: themeStyles.border }]} onPress={() => handleDoctorProfile(item._id)}>
                                <Image source={{ uri: item.image || 'https://avatar.iran.liara.run/public' }} style={styles.DoctorCardImg} />
                                <View style={styles.DoctorCardDetails}>
                                    <Text style={[styles.DoctorName, { color: themeStyles.secondary }]}>{item.name}</Text>
                                    <Text style={[styles.DoctorDescription, { color: themeStyles.text }]}>{item.specialization}</Text>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'start', alignItems: 'center' }}>
                                        <Text style={[styles.DoctorDescription, { color: themeStyles.text }]}>{item.gender} .</Text>
                                        <Text style={[styles.DoctorDescription, { color: themeStyles.text }]}> {item.experience} years</Text>
                                    </View>
                                    {/* <Text style={[styles.DoctorCardText, { color: themeStyles.text }]}>View Profile</Text> */}
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </>
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
        overflow: 'hidden',
        borderRadius: 20,
        elevation: 2,
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
    cardsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    statCard: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 5,
        elevation: 3,
    },
    statIcon: {
        fontSize: 26,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 5,
    },
    statLabel: {
        fontSize: 14,
        color: '#777',
    },

    dashboardCard: {
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    dashboardCardText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#fff',
    },

    categoryCard: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        marginRight: 10,
        elevation: 2, // Add shadow for Android,
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
        alignItems: 'center',
        padding: 8,
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 8,
        // elevation: 2, style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
    },
    DoctorCardImg: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 15,
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
