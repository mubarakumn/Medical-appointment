import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useContext } from 'react';
import useTheme from '../../hooks/useTheme';
import { useRouter } from 'expo-router';
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
  SimpleLineIcons,
} from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import TopBar from '../../components/TopBar';

const UserProfile = () => {
  const { themeStyles } = useTheme();
  const { logout, userDetails } = useContext(AuthContext);
  const navigation = useRouter();

  const handleNotification = () => {
    navigation.navigate('screens/Notifications');
  };

  const handleEditProfile = () => {
    // navigation.push('EditProfile'); // Uncomment when implemented
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <TopBar title="Profile" />

      {/* User Info */}
      <View style={styles.userDetail}>
        <Image
          source={{
            uri: userDetails?.image || 'https://www.pngmart.com/files/23/Profile-PNG-Photo.png',
          }}
          style={styles.image}
        />
        <View style={styles.details}>
          <Text style={[styles.name, { color: themeStyles.text }]}>
            {userDetails?.name || 'Guest User'}
          </Text>
          <Text style={[styles.email, { color: themeStyles.text }]}>
            {userDetails?.email || 'user@example.com'}
          </Text>
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.menusContainer}>
        {/* Edit Profile */}
        <TouchableOpacity style={[styles.menu, { borderColor: themeStyles.border }]} onPress={handleEditProfile}>
          <View style={styles.menuLeft}>
            <MaterialCommunityIcons name="account-edit-outline" size={24} color={themeStyles.text} />
            <Text style={[styles.menuText, { color: themeStyles.text }]}>Edit Profile</Text>
          </View>
          <FontAwesome name="angle-right" size={24} color={themeStyles.text} />
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity style={[styles.menu, { borderColor: themeStyles.border }]} onPress={handleNotification}>
          <View style={styles.menuLeft}>
            <MaterialIcons name="notifications" size={24} color={themeStyles.text} />
            <Text style={[styles.menuText, { color: themeStyles.text }]}>Notifications</Text>
          </View>
          <FontAwesome name="angle-right" size={24} color={themeStyles.text} />
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={[styles.menu, { borderColor: themeStyles.border }]} onPress={logout}>
          <View style={styles.menuLeft}>
            <SimpleLineIcons name="logout" size={24} color={themeStyles.text} />
            <Text style={[styles.menuText, { color: themeStyles.text }]}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Optional Footer Info */}
      <Text style={{ textAlign: 'center', color: themeStyles.icon, marginTop: 40 }}>
        Version 1.0.0
      </Text>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userDetail: {
    marginBottom: 20,
    alignItems: 'center',
    paddingVertical: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  details: {
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
  },
  menusContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  menu: {
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
  },
});
