import { signInAnonymously, signOut } from "firebase/auth";
import { auth } from "./firebase";

export async function anonymousLogin() {
  if (!auth) return { uid: "demo-user" };
  const result = await signInAnonymously(auth);
  return result.user;
}

export async function logout() {
  if (auth) await signOut(auth);
}