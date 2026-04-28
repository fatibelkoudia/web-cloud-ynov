import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export async function signUpWithEmailAndPassword(email: string, password: string) {
  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Utilisateur créé avec succès:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    throw error;
  }
}
