import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import app from '../firebaseConfig';
import { Toast } from '../components/Toast';

export default function PhoneOTPPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const router = useRouter();

  const auth = getAuth(app);
  auth.settings.appVerificationDisabledForTesting = true;

  const handleSendOTP = async () => {
    const cleanPhone = phoneNumber.replace(/\s/g, '');
    if (!cleanPhone.startsWith('+')) {
      Alert.alert('Erreur', "Le numéro doit commencer par l'indicatif, ex: +33612345678");
      return;
    }

    setLoading(true);
    try {
      if (!(window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
      }
      const result = await signInWithPhoneNumber(auth, cleanPhone, (window as any).recaptchaVerifier);
      setConfirmationResult(result);
      setStep('otp');
      Alert.alert('Succès', 'Code SMS envoyé.');
    } catch (error: any) {
      console.log('Erreur envoi SMS :', error);
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!confirmationResult) {
      Alert.alert('Erreur', "Veuillez d'abord entrer votre numéro de téléphone.");
      return;
    }

    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      console.log('Connexion téléphone réussie :', result.user);
      setToast('Connexion par SMS réussie !');
      setTimeout(() => {
        setToast(null);
        router.replace('/profil');
      }, 2000);
    } catch (error: any) {
      console.log('Erreur code :', error);
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    setStep('phone');
    setOtp('');
    setConfirmationResult(null);
    (window as any).recaptchaVerifier = null;
  };

  return (
    <KeyboardAvoidingView style={styles.wrapper} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Toast message={toast} />
      {Platform.OS === 'web' && (
        // @ts-ignore
        <div id="recaptcha-container" />
      )}
      <View style={styles.container}>
        {step === 'phone' ? (
          <>
            <Text style={styles.title}>Connexion par SMS</Text>
            <Text style={styles.subtitle}>Entrez votre numéro au format international</Text>

            <TextInput
              placeholder="+33612345678"
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              editable={!loading}
              placeholderTextColor="#999"
            />

            <Pressable style={[styles.button, loading && styles.disabled]} onPress={handleSendOTP} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'Envoi...' : 'Envoyer le code'}</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.title}>Vérification</Text>
            <Text style={styles.subtitle}>Code envoyé au {phoneNumber}</Text>

            <TextInput
              placeholder="000000"
              style={[styles.input, styles.inputOTP]}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              editable={!loading}
              placeholderTextColor="#999"
            />

            <Pressable style={[styles.button, loading && styles.disabled]} onPress={handleVerifyOTP} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'Vérification...' : 'Vérifier'}</Text>
            </Pressable>

            <Pressable style={styles.linkButton} onPress={handleGoBack} disabled={loading}>
              <Text style={styles.linkText}>Utiliser un autre numéro</Text>
            </Pressable>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 8, textAlign: 'center', color: '#111' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 28, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#ddd', backgroundColor: '#fafafa',
    padding: 13, marginBottom: 14, borderRadius: 8, fontSize: 15,
  },
  inputOTP: { textAlign: 'center', fontSize: 22, letterSpacing: 8 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  disabled: { opacity: 0.6 },
  linkButton: { marginTop: 16, padding: 10, alignItems: 'center' },
  linkText: { color: '#007AFF', fontWeight: '600' },
});
