import { View, Text, Pressable, StyleSheet, Image, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { onAuthStateChanged, signOut, User, updateProfile } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { uploadFileAndGetURL } from '../../firebase/storage_upload_file';

export default function ProfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0].uri && user) {
      setUploadingImage(true);
      try {
        const uri = result.assets[0].uri;
        const fileName = `avatars/${user.uid}_${Date.now()}.jpg`;
        const downloadURL = await uploadFileAndGetURL(uri, fileName);
        
        await updateProfile(user, { photoURL: downloadURL });
        setPhotoURL(downloadURL);
        Alert.alert('Succès', 'Photo de profil mise à jour !');
      } catch (error: any) {
        Alert.alert('Erreur', 'Impossible de télécharger l\'image : ' + error.message);
      } finally {
        setUploadingImage(false);
      }
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
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Chargement...</Text>
      </View>
    );
  }

  if (!user) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {photoURL ? (
            <Image source={{ uri: photoURL }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarPlaceholderText}>
                {displayName ? displayName.charAt(0).toUpperCase() : '?'}
              </Text>
            </View>
          )}
          {uploadingImage && (
            <View style={styles.avatarOverlay}>
              <ActivityIndicator color="#fff" />
            </View>
          )}
        </View>
        <Pressable style={styles.editPhotoButton} onPress={pickImage} disabled={uploadingImage}>
          <Text style={styles.editPhotoText}>{uploadingImage ? 'Téléchargement...' : 'Modifier la photo'}</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>Mon Profil</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Modifier mes infos</Text>
        <Text style={styles.inputLabel}>Nom d'affichage</Text>
        <TextInput
          placeholder="Nom d'affichage"
          style={styles.input}
          value={displayName}
          onChangeText={setDisplayName}
        />
        <Pressable 
          style={[styles.updateButton, updating && styles.disabled]} 
          onPress={handleUpdateProfile}
          disabled={updating}
        >
          <Text style={styles.buttonText}>{updating ? 'Mise à jour...' : 'Enregistrer le nom'}</Text>
        </Pressable>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informations de compte</Text>
        <View style={styles.infoRow}><Text style={styles.label}>Email :</Text><Text style={styles.value}>{user.email}</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>ID Utilisateur :</Text><Text style={styles.value}>{user.uid}</Text></View>
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Déconnexion</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center', backgroundColor: '#f5f5f5' },
  header: { alignItems: 'center', marginBottom: 20 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#fff' },
  avatarPlaceholder: { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' },
  avatarPlaceholderText: { fontSize: 40, color: '#fff', fontWeight: 'bold' },
  avatarOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 60, justifyContent: 'center', alignItems: 'center' },
  editPhotoButton: { marginTop: 10, paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#eee', borderRadius: 15 },
  editPhotoText: { fontSize: 13, color: '#007AFF', fontWeight: '600' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  card: { backgroundColor: '#fff', width: '100%', padding: 20, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15, color: '#333' },
  inputLabel: { fontSize: 12, color: '#888', marginBottom: 4, marginLeft: 4 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 16, backgroundColor: '#fafafa' },
  infoSection: { width: '100%', marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#888', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, paddingHorizontal: 5 },
  label: { fontWeight: '600', color: '#444' },
  value: { color: '#666' },
  providerCard: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#eee' },
  providerText: { fontWeight: 'bold', color: '#495057' },
  providerSubText: { fontSize: 12, color: '#6c757d' },
  updateButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  logoutButton: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 8, alignItems: 'center', width: '100%', marginTop: 10, marginBottom: 40 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  disabled: { opacity: 0.5 }
});
