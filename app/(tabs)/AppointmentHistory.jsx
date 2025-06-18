import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import TopBar from '../../components/TopBar'
import useTheme from '../../hooks/useTheme'

export default function AppointmentHistory() {
  const { themeStyles } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background}]}>
      <TopBar
      title={"Appointment History"}
      />
      <Text>AppointmentHistory</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
})