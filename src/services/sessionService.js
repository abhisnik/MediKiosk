import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export async function createSession(data) {
  if (!db) return { id: crypto.randomUUID(), ...data };
  const ref = await addDoc(collection(db, "sessions"), { ...data, createdAt: serverTimestamp() });
  return { id: ref.id, ...data };
}