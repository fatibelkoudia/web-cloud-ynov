import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';

export default function ProfilPage() {
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/connexion');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon Profil</Text>
      {user ? (
        <>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.userId}>ID: {user.uid}</Text>
          <Pressable style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Déconnexion</Text>
          </Pressable>
        </>
      ) : (
        <Text style={styles.subtitle}>Non connecté</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  email: { fontSize: 18, marginBottom: 10 },
  userId: { fontSize: 14, color: '#666', marginBottom: 30 },
  subtitle: { fontSize: 16, color: '#999' },
  button: { backgroundColor: '#FF3B30', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
