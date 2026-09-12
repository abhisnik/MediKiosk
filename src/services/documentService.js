import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";

import {
  getFunctions,
  httpsCallable
} from "firebase/functions";

import {
  storage,
  app
} from "./firebase";


export async function uploadDocument(
  file,
  patientId = "demo"
) {
  if (!storage) {
    return {
      name: file.name,
      type: file.type,
      size: file.size,
      demo: true
    };
  }

  const storagePath =
    `patients/${patientId}/documents/` +
    `${Date.now()}-${file.name}`;

  const storageRef =
    ref(storage, storagePath);

  await uploadBytes(
    storageRef,
    file
  );

  const url =
    await getDownloadURL(storageRef);

  return {
    name: file.name,
    type: file.type,
    size: file.size,
    url,
    storagePath
  };
}


export async function processDocument(
  file,
  uploadedDocument
) {
  // Firebase is not configured yet.
  if (!app || !uploadedDocument?.storagePath) {
    return {
      status: "demo",
      documentType: "Medical document",
      mainSections: [
        {
          section: "Document",
          content:
            "Connect Firebase and Gemini AI to analyze this document."
        }
      ],
      keyFindings: [],
      medications: [],
      labResults: [],
      diagnoses: [],
      dates: [],
      doctorSummary:
        "AI document analysis is not connected yet."
    };
  }

  const functions = getFunctions(app);

  const analyzeMedicalDocument =
    httpsCallable(
      functions,
      "analyzeMedicalDocument"
    );

  const result =
    await analyzeMedicalDocument({
      storagePath:
        uploadedDocument.storagePath,

      mimeType:
        file.type,

      fileName:
        file.name
    });

  return result.data;
}