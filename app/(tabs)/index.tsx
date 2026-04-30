import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomePage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue</Text>
      <Text style={styles.subtitle}>Connectez-vous ou créez un compte pour continuer.</Text>

      <Pressable style={styles.btnPrimary} onPress={() => router.push('/connexion')}>
        <Text style={styles.btnText}>Se connecter</Text>
      </Pressable>

      <Pressable style={styles.btnSecondary} onPress={() => router.push('/inscription')}>
        <Text style={styles.btnTextSecondary}>Créer un compte</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 28, backgroundColor: '#fff' },
  title: { fontSize: 30, fontWeight: 'bold', marginBottom: 10, color: '#111' },
  subtitle: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 36, lineHeight: 22 },
  btnPrimary: { backgroundColor: '#007AFF', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 8, marginBottom: 12, width: '100%', alignItems: 'center' },
  btnSecondary: { backgroundColor: '#fff', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 8, borderWidth: 1, borderColor: '#007AFF', width: '100%', alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnTextSecondary: { color: '#007AFF', fontWeight: '700', fontSize: 15 },
});
