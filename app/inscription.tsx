import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { signUpWithEmailAndPassword } from '../firebase/auth_signup_password';

export default function InscriptionPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleInscription = async () => {
    if (!name.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre nom.');
      return;
    }
    try {
      await signUpWithEmailAndPassword(email, password, name);
      router.replace('/(tabs)/profil');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Erreur', 'Cette adresse e-mail est déjà utilisée par un autre compte.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Erreur', 'L\'adresse e-mail n\'est pas valide.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Erreur', 'Le mot de passe est trop faible.');
      } else {
        Alert.alert('Erreur', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>

      <TextInput
        placeholder="Nom"
        style={styles.input}
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Mot de passe"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.button} onPress={handleInscription}>
        <Text style={styles.buttonText}>S'inscrire</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});
