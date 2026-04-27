import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  
  const handlePress = () => {
    Alert.alert('Button Pressed', 'You just interacted with the app!');
  };

  return (
    <View style={styles.container}>
      {/* Header Area */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome </Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.greeting}>Hi there!</Text>
        <Text style={styles.subtitle}>This is your simple React Native example.</Text>
        
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Click Me</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Light grey background
  },
  header: {
    marginTop: 60,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 20,
    color: '#007AFF', // iOS Blue
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});