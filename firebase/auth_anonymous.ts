import { getAuth, signInAnonymously } from "firebase/auth";

export async function signInAnonymous() {
  const auth = getAuth();
  const result = await signInAnonymously(auth);
  console.log("Connexion anonyme réussie:", result.user.uid);
  return { user: result.user };
}
