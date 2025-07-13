import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import useTheme from '../hooks/useTheme';

export default function NotFoundScreen() {
  const { themeStyles, theme } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!', headerTintColor: themeStyles.text }} />
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={themeStyles.background}
      />
      <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
        <Text style={[styles.title, { color: themeStyles.text }]}>😕 Oops! Page Not Found</Text>
        <Text style={{ color: themeStyles.icon, marginBottom: 20 }}>
          The screen you're trying to access doesn't exist.
        </Text>
        <Link href="/" asChild>
          <TouchableOpacity style={[styles.button, { backgroundColor: themeStyles.primary }]}>
            <Text style={styles.buttonText}>Go to Home</Text>
          </TouchableOpacity>
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
