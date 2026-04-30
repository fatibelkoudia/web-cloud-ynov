import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export async function signUpWithEmailAndPassword(email: string, password: string, displayName: string) {
  const auth = getAuth();
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(userCredential.user, { displayName });
  }
  return userCredential.user;
}
