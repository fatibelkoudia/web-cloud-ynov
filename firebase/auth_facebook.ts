import { Platform } from "react-native";
import { FacebookAuthProvider, getAuth } from "firebase/auth";

const provider = new FacebookAuthProvider();
provider.addScope("email");

export async function signinWithFacebook() {
  if (Platform.OS !== "web") {
    throw new Error("La connexion Facebook via popup est disponible uniquement sur le web.");
  }

  const { signInWithPopup } = await import("firebase/auth");
  const auth = getAuth();
  const result = await signInWithPopup(auth, provider);

  return { user: result.user };
}
