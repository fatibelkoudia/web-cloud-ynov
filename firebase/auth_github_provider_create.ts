import { GithubAuthProvider } from "firebase/auth";

export function createGithubProvider() {
  const provider = new GithubAuthProvider();
  provider.addScope("read:user");
  provider.addScope("user:email");
  return provider;
}
