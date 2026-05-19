import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { getPostById } from '../../firebase/get_single_post';
import { Post } from '../../firebase/get_post_data';
import { CommonStyles, Colors } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';

export default function BlogPostDetail() {
  const { slug } = useLocalSearchParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      getPostById(slug as string)
        .then(setPost)
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <View style={CommonStyles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={CommonStyles.center}>
        <Text style={styles.errorText}>Post introuvable.</Text>
        <Pressable style={[CommonStyles.button, CommonStyles.buttonPrimary]} onPress={() => router.back()}>
          <Text style={CommonStyles.buttonText}>Retour</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={CommonStyles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        <Text style={styles.backText}>Retour</Text>
      </Pressable>

      <View style={CommonStyles.card}>
        <Text style={styles.date}>
          {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : 'Date inconnue'}
        </Text>
        <Text style={CommonStyles.title}>{post.title}</Text>
        <Text style={styles.author}>Par {post.authorName}</Text>
        <View style={styles.divider} />
        <Text style={styles.content}>{post.content}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backText: { color: Colors.primary, marginLeft: 8, fontSize: 16, fontWeight: '600' },
  date: { color: Colors.textSecondary, fontSize: 12, marginBottom: 8, textTransform: 'uppercase' },
  author: { color: Colors.primary, fontWeight: 'bold', marginBottom: 15 },
  divider: { height: 1, backgroundColor: Colors.gray, marginBottom: 20 },
  content: { fontSize: 16, color: Colors.text, lineHeight: 26 },
  errorText: { fontSize: 18, marginBottom: 20, color: Colors.danger },
});
