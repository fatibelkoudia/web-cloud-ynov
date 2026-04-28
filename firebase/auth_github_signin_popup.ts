import { getAuth, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { createGithubProvider } from "./auth_github_provider_create";

export async function signinWithGithub() {
  const auth = getAuth();
  const provider = createGithubProvider();

  console.log("signinWithGithub");

  try {
    const result = await signInWithPopup(auth, provider);

    // This gives you a GitHub Access Token. You can use it to access the GitHub API.
    const credential = GithubAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;

    // The signed-in user info.
    const user = result.user;

    // IdP data available using getAdditionalUserInfo(result)
    console.log("signin success with github");

    return { user, token, credential };
  } catch (error: any) {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;

    // The email of the user's account used.
    const email = error.customData?.email;

    // The AuthCredential type that was used.
    const credential = GithubAuthProvider.credentialFromError(error);

    console.error("signin error with github", {
      errorCode,
      errorMessage,
      email,
      credential,
    });

    throw error;
  }
}
