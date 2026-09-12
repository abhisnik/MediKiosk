import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export async function recordConsent(consent) {
  if (!db) return { ...consent, demo: true };
  const ref = await addDoc(collection(db, "consents"), { ...consent, createdAt: serverTimestamp() });
  return { id: ref.id, ...consent };
}