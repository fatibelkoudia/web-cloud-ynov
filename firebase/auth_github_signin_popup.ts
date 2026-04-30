import { Platform } from "react-native";
import { getAuth, GithubAuthProvider } from "firebase/auth";
import { provider } from "./auth_github_provider_create";

export async function signinWithGithub() {
  if (Platform.OS !== "web") {
    throw new Error("La connexion GitHub via popup est disponible uniquement sur le web.");
  }

  const { signInWithPopup } = await import("firebase/auth");
  const auth = getAuth();
  const result = await signInWithPopup(auth, provider);
  const credential = GithubAuthProvider.credentialFromResult(result);
  const token = credential?.accessToken ?? null;

  return { user: result.user, token };
}
