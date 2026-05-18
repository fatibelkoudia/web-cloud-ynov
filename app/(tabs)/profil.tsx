import { View, Text, Pressable, StyleSheet, Image, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { onAuthStateChanged, signOut, User, updateProfile } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useEffect, useState } from 'react';

export default function ProfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setDisplayName(currentUser.displayName || '');
        setPhotoURL(currentUser.photoURL || '');
      }
      setLoading(false);
      if (!currentUser && !loading) {
        router.replace('/connexion');
      }
    });

    return () => unsubscribe();
  }, [loading]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/connexion');
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!auth.currentUser) return;
    setUpdating(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName,
        photoURL: photoURL
      });
      Alert.alert('Succès', 'Profil mis à jour !');
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (!user) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user.photoURL && (
        <Image source={{ uri: user.photoURL }} style={styles.avatar} />
      )}
      <Text style={styles.title}>Mon Profil</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Modifier mes infos</Text>
        <TextInput
          placeholder="Nom d'affichage"
          style={styles.input}
          value={displayName}
          onChangeText={setDisplayName}
        />
        <TextInput
          placeholder="URL de la photo"
          style={styles.input}
          value={photoURL}
          onChangeText={setPhotoURL}
        />
        <Pressable 
          style={[styles.updateButton, updating && styles.disabled]} 
          onPress={handleUpdateProfile}
          disabled={updating}
        >
          <Text style={styles.buttonText}>{updating ? 'Mise à jour...' : 'Enregistrer les modifications'}</Text>
        </Pressable>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informations de compte</Text>
        <View style={styles.infoRow}><Text style={styles.label}>Email :</Text><Text style={styles.value}>{user.email}</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>UID :</Text><Text style={styles.value}>{user.uid}</Text></View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Fournisseurs d'accès</Text>
        {user.providerData.map((profile, index) => (
          <View key={index} style={styles.providerCard}>
            <Text style={styles.providerText}>Source : {profile.providerId}</Text>
            <Text style={styles.providerSubText}>ID : {profile.uid}</Text>
            {profile.email && <Text style={styles.providerSubText}>Email : {profile.email}</Text>}
          </View>
        ))}
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Déconnexion</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center', backgroundColor: '#f5f5f5' },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10, borderWidth: 3, borderColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  card: { backgroundColor: '#fff', width: '100%', padding: 20, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 12, backgroundColor: '#fafafa' },
  infoSection: { width: '100%', marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#666', marginBottom: 10, textTransform: 'uppercase' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, paddingHorizontal: 5 },
  label: { fontWeight: '600', color: '#444' },
  value: { color: '#666' },
  providerCard: { backgroundColor: '#e9ecef', padding: 12, borderRadius: 8, marginBottom: 8 },
  providerText: { fontWeight: 'bold', color: '#495057' },
  providerSubText: { fontSize: 12, color: '#6c757d' },
  updateButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  logoutButton: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 8, alignItems: 'center', width: '100%', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  disabled: { opacity: 0.5 }
});
