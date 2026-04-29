import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export async function signUpWithEmailAndPassword(email: string, password: string, displayName: string) {
  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    
    console.log("Utilisateur créé avec succès:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    throw error;
  }
}
