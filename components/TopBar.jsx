import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { Feather, MaterialIcons } from '@expo/vector-icons';
import useTheme from '../hooks/useTheme';

const TopBar = ({ title }) => {
    const router = useRouter();
    const {themeStyles} = useTheme();

       // Navigate to the menu screen
   const handleNotification = () => {
    router.push('screens/Notifications');
  }

    return (
        <View style={styles.navbar}>
            <TouchableOpacity onPress={()=> router.back()}>
                <Feather name="arrow-left" size={24} color={themeStyles.text} />
            </TouchableOpacity>
            <Text style={[styles.header, { color: themeStyles.text }]}>{title}</Text>
            <MaterialIcons name="notifications" size={30} color={themeStyles.text} onPress={handleNotification} />
        </View>
    )
}

export default TopBar

const styles = StyleSheet.create({
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
})