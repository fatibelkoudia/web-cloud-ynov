import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="connexion" />
      <Stack.Screen name="inscription" />
      <Stack.Screen name="blog/[slug]" />
    </Stack>
  );
}
