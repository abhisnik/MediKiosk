import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export async function writeAuditEvent(event) {
  if (!db) return { ...event, demo: true };
  return addDoc(collection(db, "auditLogs"), { ...event, createdAt: serverTimestamp() });
}