import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Link } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { signinWithGithub } from '../../firebase/auth_github_signin_popup';
import { signinWithFacebook } from '../../firebase/auth_facebook';
import { signInAnonymous } from '../../firebase/auth_anonymous';
import { Toast } from '../../components/Toast';
import { CommonStyles, Colors } from '../../constants/Theme';

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
      <ScrollView contentContainerStyle={CommonStyles.container} keyboardShouldPersistTaps="handled">
        <Text style={CommonStyles.title}>Se connecter</Text>

        <View style={CommonStyles.card}>
          <Text style={CommonStyles.label}>Email</Text>
          <TextInput
            placeholder="votre@email.com"
            style={CommonStyles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
          <Text style={CommonStyles.label}>Mot de passe</Text>
          <TextInput
            placeholder="******"
            secureTextEntry
            style={CommonStyles.input}
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />

          <Pressable 
            style={[CommonStyles.button, CommonStyles.buttonPrimary, loading && CommonStyles.disabled]} 
            onPress={handleEmailLogin} 
            disabled={loading}
          >
            {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={CommonStyles.buttonText}>Connexion Email</Text>}
          </Pressable>
        </View>

        <Text style={styles.divider}>OU</Text>

        <Pressable style={[CommonStyles.button, styles.btnGithub, loading && CommonStyles.disabled]} onPress={handleGithub} disabled={loading}>
          <Text style={CommonStyles.buttonText}>Se connecter avec GitHub</Text>
        </Pressable>

        <Pressable style={[CommonStyles.button, styles.btnFacebook, loading && CommonStyles.disabled]} onPress={handleFacebook} disabled={loading}>
          <Text style={CommonStyles.buttonText}>Se connecter avec Facebook</Text>
        </Pressable>

        <Pressable style={[CommonStyles.button, styles.btnPhone, loading && CommonStyles.disabled]} onPress={() => router.push('/connexion_phone')} disabled={loading}>
          <Text style={CommonStyles.buttonText}>Se connecter par SMS</Text>
        </Pressable>

        <Pressable style={[CommonStyles.button, styles.btnAnon, loading && CommonStyles.disabled]} onPress={handleAnonymous} disabled={loading}>
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
  wrapper: { flex: 1, backgroundColor: Colors.background },
  btnGithub: { backgroundColor: '#333', marginBottom: 8 },
  btnFacebook: { backgroundColor: '#1877F2', marginBottom: 8 },
  btnPhone: { backgroundColor: Colors.success, marginBottom: 8 },
  btnAnon: { backgroundColor: Colors.gray, marginBottom: 16 },
  btnTextDark: { color: Colors.text, fontWeight: 'bold', fontSize: 16 },
  divider: { textAlign: 'center', marginVertical: 12, color: Colors.textSecondary, fontWeight: '600' },
  link: { marginTop: 8 },
  linkText: { color: Colors.primary, textAlign: 'center', fontWeight: '600' },
});
