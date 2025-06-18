import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import useTheme from '../hooks/useTheme'; // Import the useTheme hook

export default function NotFoundScreen() {
  const { themeStyles } = useTheme(); // Destructure themeStyles from useTheme

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!', headerTintColor: themeStyles.background }} />
      <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
        <Text style={{ color: themeStyles.text }}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={{ color: themeStyles.text }}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
