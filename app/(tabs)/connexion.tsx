import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Link } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { signinWithGithub } from '../../firebase/auth_github_signin_popup';
import { signinWithFacebook } from '../../firebase/auth_facebook';
import { signInAnonymous } from '../../firebase/auth_anonymous';
import { Toast } from '../../components/Toast';

export default function ConexionPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const router = useRouter();

  const showToastAndNavigate = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
      router.replace('/profil');
    }, 2000);
  };

  const handleEmailLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToastAndNavigate('Connexion réussie !');
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        Alert.alert('Erreur', 'Email ou mot de passe incorrect.');
      } else if (error.code === 'auth/user-not-found') {
        Alert.alert('Erreur', 'Aucun compte trouvé pour cet email.');
      } else {
        Alert.alert('Erreur', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGithub = async () => {
    setLoading(true);
    try {
      await signinWithGithub();
      showToastAndNavigate('Connexion GitHub réussie !');
    } catch (error: any) {
      Alert.alert('Erreur', error?.message || 'Connexion GitHub impossible.');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebook = async () => {
    setLoading(true);
    try {
      await signinWithFacebook();
      showToastAndNavigate('Connexion Facebook réussie !');
    } catch (error: any) {
      Alert.alert('Erreur', error?.message || 'Connexion Facebook impossible.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymous = async () => {
    setLoading(true);
    try {
      await signInAnonymous();
      showToastAndNavigate('Connexion anonyme réussie !');
    } catch {
      Alert.alert('Erreur', 'Connexion anonyme impossible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Toast message={toast} />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Se connecter</Text>

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
        <TextInput
          placeholder="Mot de passe"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />

        <Pressable style={[styles.btn, loading && styles.disabled]} onPress={handleEmailLogin} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Connexion...' : 'Connexion Email'}</Text>
        </Pressable>

        <Text style={styles.divider}>OU</Text>

        <Pressable style={[styles.btnGithub, loading && styles.disabled]} onPress={handleGithub} disabled={loading}>
          <Text style={styles.btnText}>Se connecter avec GitHub</Text>
        </Pressable>

        <Pressable style={[styles.btnFacebook, loading && styles.disabled]} onPress={handleFacebook} disabled={loading}>
          <Text style={styles.btnText}>Se connecter avec Facebook</Text>
        </Pressable>

        <Pressable style={[styles.btnPhone, loading && styles.disabled]} onPress={() => router.push('/connexion_phone')} disabled={loading}>
          <Text style={styles.btnText}>Se connecter par SMS</Text>
        </Pressable>

        <Pressable style={[styles.btnAnon, loading && styles.disabled]} onPress={handleAnonymous} disabled={loading}>
          <Text style={styles.btnTextDark}>Continuer anonymement</Text>
        </Pressable>

        <Link href="/inscription" style={styles.link}>
          <Text style={styles.linkText}>Pas encore inscrit ? Créer un compte</Text>
        </Link>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 12, borderRadius: 8 },
  btn: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  btnGithub: { backgroundColor: '#333', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  btnFacebook: { backgroundColor: '#1877F2', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  btnPhone: { backgroundColor: '#34C759', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  btnAnon: { backgroundColor: '#E5E5EA', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  btnTextDark: { color: '#333', fontWeight: 'bold' },
  disabled: { opacity: 0.6 },
  divider: { textAlign: 'center', marginVertical: 12, color: '#999', fontWeight: '600' },
  link: { marginTop: 8 },
  linkText: { color: '#007AFF', textAlign: 'center' },
});
