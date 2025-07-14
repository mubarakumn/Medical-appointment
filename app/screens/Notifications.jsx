import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopBar from '../../components/TopBar';
import useTheme from '../../hooks/useTheme';
import axios from 'axios';

export default function Notifications() {
  const { themeStyles } = useTheme();
  const { userDetails } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get('https://medical-appointment-backend-five.vercel.app/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
      console.log(res.data)
    } catch (err) {
      console.log(err)
      Alert.alert('Error', 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.card, { backgroundColor: themeStyles.background }]}>
      <View style={[styles.cardIcon, { backgroundColor: themeStyles.primary }]}>
        <AntDesign name="calendar" size={24} color={themeStyles.text} />
      </View>
      <View style={styles.message}>
        <Text style={[styles.cardTitle, { color: themeStyles.text }]}>{item.title}</Text>
        <Text style={[styles.cardText, { color: themeStyles.text }]} numberOfLines={3}>{item.text}</Text>
        <Text style={[styles.date, { color: themeStyles.icon }]}>
          {new Date(item.date).toLocaleString()}
        </Text>
      </View>
      <Entypo name="dots-three-vertical" size={18} color={themeStyles.icon} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.card }]}>
      <TopBar title={"Notifications"} />
      {loading ? (
        <ActivityIndicator size="large" color={themeStyles.primary} />
      ) : notifications.length === 0 ? (
        <Text style={{ color: themeStyles.text, textAlign: 'center', marginTop: 30 }}>No notifications</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.cardList}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cardList: { padding: 10, paddingBottom: 50 },
  card: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
    alignItems: 'center',
    borderColor: '#ddd',
  },
  cardIcon: {
    padding: 10,
    borderRadius: 30,
    marginRight: 10,
  },
  message: {
    flex: 1,
    marginRight: 10,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardText: {
    fontSize: 14,
    marginVertical: 4,
  },
  date: {
    fontSize: 12,
  },
});
