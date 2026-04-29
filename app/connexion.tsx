import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function ConexionPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleConnexion = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)/profil');
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
        Alert.alert('Erreur', 'Email ou mot de passe incorrect.');
      } else if (error.code === 'auth/user-not-found') {
        Alert.alert('Erreur', 'Utilisateur non trouvé. Veuillez vérifier votre email.');
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('Erreur', 'Mot de passe incorrect.');
      } else {
        Alert.alert('Erreur', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Se connecter</Text>

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

      <Pressable style={styles.button} onPress={handleConnexion}>
        <Text style={styles.buttonText}>Connexion</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
