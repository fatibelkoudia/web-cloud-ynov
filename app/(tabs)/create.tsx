import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { addBlogPost } from '../../firebase/add_post_data';
import { CommonStyles, Colors } from '../../constants/Theme';

export default function AjouterPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("Checking auth state for AjouterPost...");
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser && !loading) {
        console.warn("User not logged in, redirecting to connexion");
        router.replace('/connexion');
      }
    });
    return () => unsubscribe();
  }, [loading]);

  const handleSubmit = async () => {
    console.log("Publish button clicked");
    if (!title.trim() || !content.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    if (!user) {
      console.error("No user found during submission");
      return;
    }

    setSending(true);
    try {
      console.log("Attempting to add post to Firestore...");
      const postId = await addBlogPost(title, content, user.uid, user.displayName || 'Anonyme');
      console.log("Post successfully created with ID:", postId);
      
      Alert.alert('Succès', 'Votre post a été publié !');
      
      // Reset form
      setTitle('');
      setContent('');
      
      // Redirect to home
      console.log("Redirecting to home page...");
      router.replace('/');
    } catch (error: any) {
      console.error("Error during post publication:", error);
      Alert.alert('Erreur', 'Impossible de publier le post : ' + error.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <View style={CommonStyles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!user) return null;

  return (
    <ScrollView contentContainerStyle={CommonStyles.container}>
      <Text style={CommonStyles.title}>Nouveau Post</Text>
      
      <View style={CommonStyles.card}>
        <Text style={CommonStyles.label}>Titre du post</Text>
        <TextInput
          style={CommonStyles.input}
          placeholder="Ex: Mon premier voyage en Islande"
          value={title}
          onChangeText={setTitle}
          editable={!sending}
        />

        <Text style={CommonStyles.label}>Contenu</Text>
        <TextInput
          style={[CommonStyles.input, styles.textArea]}
          placeholder="Racontez votre histoire..."
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          editable={!sending}
        />

        <Pressable 
          style={[CommonStyles.button, CommonStyles.buttonSuccess, sending && CommonStyles.disabled]} 
          onPress={handleSubmit}
          disabled={sending}
        >
          <Text style={CommonStyles.buttonText}>{sending ? 'Publication...' : 'Publier le post'}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textArea: { minHeight: 150 },
});
