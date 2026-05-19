import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { signUpWithEmailAndPassword } from '../../firebase/auth_signup_password';
import { Toast } from '../../components/Toast';
import { CommonStyles, Colors } from '../../constants/Theme';

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
      <ScrollView contentContainerStyle={CommonStyles.container} keyboardShouldPersistTaps="handled">
        <Text style={CommonStyles.title}>Créer un compte</Text>

        <View style={CommonStyles.card}>
          <Text style={CommonStyles.label}>Nom complet</Text>
          <TextInput
            placeholder="John Doe"
            style={CommonStyles.input}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            editable={!loading}
            placeholderTextColor="#999"
          />
          <Text style={CommonStyles.label}>Email</Text>
          <TextInput
            placeholder="votre@email.com"
            style={CommonStyles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
            placeholderTextColor="#999"
          />
          <Text style={CommonStyles.label}>Mot de passe</Text>
          <TextInput
            placeholder="6 caractères min."
            secureTextEntry
            style={CommonStyles.input}
            value={password}
            onChangeText={setPassword}
            editable={!loading}
            placeholderTextColor="#999"
          />

          <Pressable
            style={[CommonStyles.button, CommonStyles.buttonPrimary, loading && CommonStyles.disabled]}
            onPress={handleInscription}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={CommonStyles.buttonText}>S'inscrire</Text>}
          </Pressable>
        </View>

        <Pressable onPress={() => router.push('/connexion')} style={styles.loginLink}>
          <Text style={styles.loginLinkText}>Déjà un compte ? Se connecter</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: Colors.background },
  loginLink: { marginTop: 16, alignItems: 'center' },
  loginLinkText: { color: Colors.primary, fontWeight: '600' },
});
