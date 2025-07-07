import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useContext } from 'react'
import useTheme from '../../hooks/useTheme'
import { useRouter } from 'expo-router'
import { FontAwesome, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons'
// import MyButton from '../../components/myButton'
import { AuthContext } from '../../context/AuthContext'
import TopBar from '../../components/TopBar'

const UserProfile = () => {
  const { themeStyles } = useTheme()
  const { logout, userDetails } = useContext(AuthContext);
  const navigation = useRouter()

  const handleGoback = () => {
    navigation.navigate('/')
  }

  // Navigate to the menu screen
  const handleNotification = () => {
    navigation.navigate('screens/Notifications');
  }

  // Handle edit profile
  const handleEditProfile = () => {
  }
  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <TopBar
        title={'Profile'}
      />

      <View style={styles.userDetail}>
        <Image source={{ uri: 'https://www.pngmart.com/files/23/Profile-PNG-Photo.png' }} style={styles.image} />
        <View style={styles.details}>
          <Text style={{ color: themeStyles.text, fontWeight: 'bold', textAlign: 'center' }}>{userDetails.name}</Text>
          <Text style={{ color: themeStyles.text, textAlign: 'center' }}>{userDetails.email}</Text>
        </View>
      </View>

      <View style={styles.menusContainer}>
        <TouchableOpacity style={[styles.menu, { borderColor: themeStyles.border }]} onPress={handleEditProfile}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {/* icon */}
            <MaterialCommunityIcons name="account-edit-outline" size={24} color={themeStyles.text} />
            {/* text */}
            <Text style={{ color: themeStyles.text }} >Edit profile</Text>
          </View>
          {/* icon */}
          <FontAwesome name="angle-right" size={24} color={themeStyles.text} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menu, { borderColor: themeStyles.border }]} onPress={handleNotification}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {/* icon */}
            <MaterialIcons name="notifications" size={24} color={themeStyles.text} />
            {/* text */}
            <Text style={{ color: themeStyles.text }} >Notifications</Text>
          </View>
          {/* icon */}
          <FontAwesome name="angle-right" size={24} color={themeStyles.text} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menu, { borderColor: themeStyles.border }]} onPress={() => logout()}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {/* icon */}
            <SimpleLineIcons name="logout" size={24} color={themeStyles.text} />
            {/* text */}
            <Text style={{ color: themeStyles.text }} >Log Out</Text>
          </View>
          {/* icon */}
          {/* <FontAwesome name="angle-right" size={24} color={themeStyles.text}  /> */}
        </TouchableOpacity>
      </View>
      {/* <MyButton title="Edit Profile" onPress={()=>navigation.navigate('EditProfile')} /> */}
    </View>
  )
}

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userDetail: {
    marginBottom: 20,
  },
  details: {
    flexDirection: 'column'
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 20,
  },
  menusContainer: {
    padding: 15,
    flexDirection: 'column',
  },
  menu: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
})