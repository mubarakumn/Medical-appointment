// import React, { useEffect, useState, useContext } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
// import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
// import { AuthContext } from '../../context/AuthContext';
// import axios from 'axios';
// import useTheme from '../../hooks/useTheme';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useRouter } from 'expo-router';
// import TopBar from '../../components/TopBar'



// const DoctorDashboard = () => {
//   const { userDetails } = useContext(AuthContext);
//   const { themeStyles, theme } = useTheme();
//   const [stats, setStats] = useState({ appointments: 0, slots: 0, patients: 0 });
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
  


//   const fetchStats = async () => {
//     const token = await AsyncStorage.getItem('token');
//     try {
//       const res = await axios.get(`https://medical-appointment-backend-five.vercel.app/api/users/doctor/stats`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setStats(res.data);
//     } catch (err) {
//       console.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStats();
//   }, []);

//     // Navigate to the login screen
//     const handleProfile = () => {
//         router.push('profile'); // Navigate to the UserProfile screen
//     };

//       // Navigate to the menu screen
//     const handleNotification = () => {
//         router.push('screens/Notifications'); // Navigate to the Notifications screen
//     }

//   return (
//     <View style={[styles.container, { backgroundColor: themeStyles.card }]}>
//       <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={themeStyles.card} />
//       {/* User Nav */}
//       <View style={styles.nav}>
//           {/* profile nav */}
//           <TouchableOpacity onPress={handleProfile}>
//               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
//                   <FontAwesome5 name="user-circle" size={30} color={themeStyles.text} />
//                   <View>
//                       <Text style={[styles.navText, { color: themeStyles.text }]}>Welcome back!</Text>
//                       <Text style={[styles.navText, { fontWeight: 'bold', color: themeStyles.text }]}>{userDetails.name || 'Guest'} 🤗 </Text>
//                   </View>
//               </View>
//           </TouchableOpacity>

//           {/* nav icon */}
//           <TouchableOpacity onPress={handleNotification}>
//               <MaterialIcons name="notifications" size={30} color={themeStyles.text} />
//           </TouchableOpacity>
//       </View>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <Text style={[styles.title, { color: themeStyles.text }]}>Doctor Dashboard</Text>

//         {loading ? (
//           <ActivityIndicator size="large" color={themeStyles.primary} />
//         ) : (
//           <>
//             <View style={styles.cardsContainer}>
//               <View style={[styles.card, { backgroundColor: themeStyles.card }]}>
//                 <Text style={styles.cardValue}>{stats.appointments}</Text>
//                 <Text style={styles.cardLabel}>Appointments</Text>
//               </View>
//               <View style={[styles.card, { backgroundColor: themeStyles.card }]}>
//                 <Text style={styles.cardValue}>{stats.slots}</Text>
//                 <Text style={styles.cardLabel}>Available Slots</Text>
//               </View>
//               <View style={[styles.card, { backgroundColor: themeStyles.card }]}>
//                 <Text style={styles.cardValue}>{stats.patients}</Text>
//                 <Text style={styles.cardLabel}>Patients</Text>
//               </View>
//             </View>

//             {/* ✅ Bottom Actions */}
//             <View style={styles.section}>
//               <Text style={[styles.sectionTitle, { color: themeStyles.text }]}>Quick Actions</Text>

//               <TouchableOpacity style={[styles.actionButton, { backgroundColor: themeStyles.card }]} onPress={() => router.push('AddSlot')}>
//                 <Text style={[styles.actionText, { color: themeStyles.text }]}>➕ Add Slot</Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={[styles.actionButton, { backgroundColor: themeStyles.card }]} onPress={() => router.push('Appointments')}>
//                 <Text style={[styles.actionText, { color: themeStyles.text }]}>📅 View All Appointments</Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={[styles.actionButton, { backgroundColor: themeStyles.card }]} onPress={() => router.push('Patients')}>
//                 <Text style={[styles.actionText, { color: themeStyles.text }]}>👥 My Patients</Text>
//               </TouchableOpacity>
//             </View>
//           </>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flexGrow: 1, padding: 15 },
//   scrollContainer: { flexGrow: 1, padding: 5, },
//   nav: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   navText: {
//       color: '#000',
//   },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
//   cardsContainer: { gap: 15, flexDirection: "row" },
//   card: {
//     padding: 10,
//     borderRadius: 15,
//     alignItems: 'center',
//     elevation: 4,
//     width: 95
//   },
//   cardValue: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   cardLabel: {
//     fontSize: 16,
//     color: '#777',
//   },
//   section: {
//     marginTop: 30,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     marginBottom: 15,
//   },
//   actionButton: {
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     borderRadius: 12,
//     marginBottom: 15,
//     elevation: 2,
//   },
//   actionText: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default DoctorDashboard;


import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import useTheme from '../../hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const DoctorDashboard = () => {
  const { userDetails } = useContext(AuthContext);
  const { themeStyles, theme } = useTheme();
  const [stats, setStats] = useState({ appointments: 0, slots: 0, patients: 0 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchStats = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await axios.get(
        `https://medical-appointment-backend-five.vercel.app/api/users/doctor/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats(res.data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleProfile = () => {
    router.push('/doctor/profile');
  };

  const handleNotification = () => {
    router.push('/screens/Notifications');
  };

  const DashboardButton = ({ icon, label, onPress }) => (
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor: themeStyles.card }]}
      onPress={onPress}
    >
      <Text style={[styles.actionText, { color: themeStyles.text }]}>{icon} {label}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: themeStyles.background }]}>
        <ActivityIndicator size="large" color={themeStyles.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.card }]}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={themeStyles.card}
      />

      {/* Top Navbar */}
      <View style={styles.nav}>
        <TouchableOpacity onPress={handleProfile}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <FontAwesome5 name="user-circle" size={30} color={themeStyles.text} />
            <View>
              <Text style={[styles.navText, { color: themeStyles.text }]}>Welcome back!</Text>
              <Text style={[styles.navText, { fontWeight: 'bold', color: themeStyles.text }]}>
                {userDetails.name || 'Doctor'} 👨‍⚕️
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNotification}>
          <MaterialIcons name="notifications" size={30} color={themeStyles.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={[styles.title, { color: themeStyles.text }]}>Doctor Dashboard</Text>

        {/* Stat Cards */}
        <View style={styles.cardsContainer}>
          <View style={[styles.card, { backgroundColor: themeStyles.card }]}>
            <Text style={styles.cardValue}>{stats.appointments}</Text>
            <Text style={styles.cardLabel}>Appointments</Text>
          </View>
          <View style={[styles.card, { backgroundColor: themeStyles.card }]}>
            <Text style={styles.cardValue}>{stats.slots}</Text>
            <Text style={styles.cardLabel}>Slots</Text>
          </View>
          <View style={[styles.card, { backgroundColor: themeStyles.card }]}>
            <Text style={styles.cardValue}>{stats.patients}</Text>
            <Text style={styles.cardLabel}>Patients</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeStyles.text }]}>Quick Actions</Text>

          <DashboardButton
            icon="➕"
            label="Add Slot"
            onPress={() => router.push('/doctor/slots')}
          />

          <DashboardButton
            icon="📅"
            label="View All Appointments"
            onPress={() => router.push('/doctor/appointments')}
          />

          <DashboardButton
            icon="👥"
            label="My Patients"
            onPress={() => router.push('/doctor/patients')}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 15 },
  scrollContainer: { flexGrow: 1, padding: 5 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardsContainer: {
    gap: 15,
    flexDirection: 'row',
  },
  card: {
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 4,
    width: 95,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardLabel: {
    fontSize: 16,
    color: '#777',
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  actionButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DoctorDashboard;
