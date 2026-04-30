import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';

export default function ProfilPage() {
  const router = useRouter();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/connexion');
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ici s'affichera prochainement votre profil</Text>
      <Pressable style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Déconnexion</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, gap: 24 },
  text: { fontSize: 16, textAlign: 'center', color: '#333' },
  button: { backgroundColor: '#FF3B30', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
