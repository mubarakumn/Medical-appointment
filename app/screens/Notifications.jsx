import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { AntDesign, Entypo, Feather, MaterialIcons } from '@expo/vector-icons'
import useTheme from '../../hooks/useTheme';
import { useRouter } from 'expo-router';
import { AuthContext } from '../../context/AuthContext';
import TopBar from '../../components/TopBar';


// Notification data
const notifications = [
  { id: 1, title: 'Reschuldule', text: 'your appointment has been reschledule your appointment has been reschledule your appointment has been reschleduleyour appointment has been reschleduleyour appointment has been reschleduleyour appointment has been reschleduleyour appointment has been reschleduleyour appointment has been reschleduleyour appointment has been reschleduleyour appointment has been reschledule', date: '2022-01-01' },
  { id: 2, title: 'New Message', text: 'you have a new message', date: '2022-01-01' },
  { id: 3, title: 'Cancellation', text: 'your appointment has been cancel', date: '2022-01-01' },
  { id: 4, title: 'Reschuldule', text: 'your appointment has been reschledule your appointment has been reschledule your appointment has been reschleduleyour appointment has been reschleduleyour appointment has been reschleduleyour appointment has been reschleduleyour appointment has been reschleduleyour appointment has been reschleduleyour appointment has been reschleduleyour appointment has been reschledule', date: '2022-01-01' },
  { id: 5, title: 'New Message', text: 'you have a new message', date: '2022-01-01' },
  { id: 6, title: 'Cancellation', text: 'your appointment has been cancel', date: '2022-01-01' },
]


export default function Notifications() {
  const { themeStyles, theme } = useTheme();
  const { userDetails } = useContext( AuthContext );
  const navigation = useRouter()

  const handleGoback = ()=>{
    navigation.navigate('/')
  }

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.card }]}>
      <TopBar
      title={"Notifications"}
      />
      
      {/* Content */}
      <View style={styles.content}>
        {notifications <= 0 ? 
        <Text style={{color: themeStyles.text}}>No notifications</Text> 
        :
        <FlatList
          data={notifications}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={styles.cardList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.card, { backgroundColor: themeStyles.background, borderColor: themeStyles.border}]}>
              <View style={[styles.cardIcon, { backgroundColor: themeStyles.primary }]}>
                <AntDesign name="calendar" size={24} color={themeStyles.text} style={{ margin: 0 }} />
              </View>
              <View style={styles.message}>
                <Text style={[styles.cardTitle, { color: themeStyles.text }]}>{item.title}</Text>
                <Text style={[styles.cardText, { color: themeStyles.text }]}>{item.text}</Text>
                <Text style={[styles.text, { color: themeStyles.text }]}>{item.date}</Text>
              </View>
              <Entypo name="dots-three-vertical" size={24} color={themeStyles.text} />
            </TouchableOpacity>
          )}
        />}
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    marginBottom: 20,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    paddingBottom: 90
  },
  cardList:{
    // borderWidth: 2,
    paddingRight: 5,
    marginBottom: 40
  },
  card: {
    width: '100%',
    padding: 20,
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 5,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
  },
  cardTitle:{
    fontWeight: 'bold',
  },
  cardIcon: {
    marginRight: 10,
    padding: 10,
    borderRadius: 30,
  },
  message:{
    width: '75%'
  },
})