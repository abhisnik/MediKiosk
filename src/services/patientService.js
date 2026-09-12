import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function savePatient(patient) {
  if (!db) return { id: "demo-patient", ...patient };
  const ref = await addDoc(collection(db, "patients"), patient);
  return { id: ref.id, ...patient };
}

export async function getPatient(id) {
  if (!db) return null;
  const snap = await getDoc(doc(db, "patients", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}