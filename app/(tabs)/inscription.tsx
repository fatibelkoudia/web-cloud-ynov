import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { signUpWithEmailAndPassword } from '../../firebase/auth_signup_password';
import { Toast } from '../../components/Toast';

export default function InscriptionPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleInscription = async () => {
    if (!name.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre nom.');
      return;
    }
    setLoading(true);
    try {
      await signUpWithEmailAndPassword(email, password, name);
      setToast('Compte créé avec succès !');
      setTimeout(() => {
        setToast(null);
        router.replace('/profil');
      }, 2000);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Erreur', 'Cette adresse e-mail est déjà utilisée.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Erreur', "L'adresse e-mail n'est pas valide.");
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères.');
      } else {
        Alert.alert('Erreur', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.wrapper} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Toast message={toast} />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Créer un compte</Text>

        <TextInput
          placeholder="Nom"
          style={styles.input}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          editable={!loading}
          placeholderTextColor="#999"
        />
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
          placeholderTextColor="#999"
        />
        <TextInput
          placeholder="Mot de passe (6 caractères min.)"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          editable={!loading}
          placeholderTextColor="#999"
        />

        <Pressable
          style={[styles.button, loading && styles.disabled]}
          onPress={handleInscription}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Création...' : "S'inscrire"}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#fff' },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 28, textAlign: 'center', color: '#111' },
  input: {
    borderWidth: 1, borderColor: '#ddd', backgroundColor: '#fafafa',
    padding: 13, marginBottom: 14, borderRadius: 8, fontSize: 15,
  },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  disabled: { opacity: 0.6 },
});
