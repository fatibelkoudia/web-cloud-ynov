import { View, Text, Pressable, StyleSheet, Image, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { onAuthStateChanged, signOut, User, updateProfile } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { uploadFileAndGetURL } from '../../firebase/storage_upload_file';
import { CommonStyles, Colors } from '../../constants/Theme';

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
      <View style={CommonStyles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 10 }}>Chargement...</Text>
      </View>
    );
  }

  if (!user) return null;

  return (
    <ScrollView contentContainerStyle={CommonStyles.container}>
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
              <ActivityIndicator color={Colors.white} />
            </View>
          )}
        </View>
        <Pressable style={styles.editPhotoButton} onPress={pickImage} disabled={uploadingImage}>
          <Text style={styles.editPhotoText}>{uploadingImage ? 'Téléchargement...' : 'Modifier la photo'}</Text>
        </Pressable>
      </View>

      <Text style={CommonStyles.title}>Mon Profil</Text>

      <View style={CommonStyles.card}>
        <Text style={styles.cardTitle}>Modifier mes infos</Text>
        <Text style={CommonStyles.label}>Nom d'affichage</Text>
        <TextInput
          placeholder="Nom d'affichage"
          style={CommonStyles.input}
          value={displayName}
          onChangeText={setDisplayName}
        />
        <Pressable 
          style={[CommonStyles.button, CommonStyles.buttonPrimary, updating && CommonStyles.disabled]} 
          onPress={handleUpdateProfile}
          disabled={updating}
        >
          <Text style={CommonStyles.buttonText}>{updating ? 'Mise à jour...' : 'Enregistrer le nom'}</Text>
        </Pressable>
      </View>

      <View style={styles.infoSection}>
        <Text style={CommonStyles.label}>Informations de compte</Text>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>Email :</Text><Text style={styles.infoValue}>{user.email}</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>ID Utilisateur :</Text><Text style={styles.infoValue}>{user.uid}</Text></View>
      </View>

      <Pressable style={[CommonStyles.button, CommonStyles.buttonDanger, styles.logoutButton]} onPress={handleLogout}>
        <Text style={CommonStyles.buttonText}>Déconnexion</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginBottom: 20 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: Colors.white },
  avatarPlaceholder: { backgroundColor: Colors.gray, justifyContent: 'center', alignItems: 'center' },
  avatarPlaceholderText: { fontSize: 40, color: Colors.white, fontWeight: 'bold' },
  avatarOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 60, justifyContent: 'center', alignItems: 'center' },
  editPhotoButton: { marginTop: 10, paddingVertical: 6, paddingHorizontal: 12, backgroundColor: Colors.gray, borderRadius: 15 },
  editPhotoText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15, color: Colors.text },
  infoSection: { width: '100%', marginBottom: 20 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, paddingHorizontal: 5 },
  infoLabel: { fontWeight: '600', color: Colors.textSecondary },
  infoValue: { color: Colors.text },
  logoutButton: { width: '100%', marginTop: 10, marginBottom: 40 },
});
