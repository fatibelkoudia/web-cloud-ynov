import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function HomePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur l'application !</Text>
      <Text style={styles.subtitle}>Explorez nos services en vous connectant.</Text>

      <Link href="/connexion" style={styles.link}>
        <Text style={styles.linkText}>Connexion</Text>
      </Link>

      <Link href="/inscription" style={styles.link}>
        <Text style={styles.linkText}>Inscription</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, marginBottom: 30, textAlign: 'center', color: '#666' },
  link: { marginVertical: 10 },
  linkText: { color: '#007AFF', fontSize: 16, fontWeight: 'bold' },
});
