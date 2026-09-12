import { useState } from "react";
import { getSession, saveSession } from "../utils/sessionUtils";

// const API_URL = "http://localhost:3001";
const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3001";

export default function useDocuments() {
  const [documents, setDocuments] = useState(() => {
    const session = getSession();
    return session.documents || [];
  });

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function addDocument(file) {
    setBusy(true);
    setError("");

    try {
      // Prepare the file for upload
      const formData = new FormData();
      formData.append("document", file);

      // Send document to our local AI server
      const response = await fetch(
        `${API_URL}/api/analyze-document`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Unable to analyze the document."
        );
      }

      // Store the analyzed document
      const document = {
        name: file.name,
        type: file.type,
        size: file.size,
        analysis: result,
      };

      setDocuments((previous) => {
        const updated = [...previous, document];

        // Keep documents available when we move to Review
        saveSession({
          documents: updated,
        });

        return updated;
      });

      return document;
    } catch (err) {
      console.error("Document analysis failed:", err);

      setError(
        err.message ||
          "Something went wrong while analyzing the document."
      );

      throw err;
    } finally {
      setBusy(false);
    }
  }

  return {
    documents,
    addDocument,
    busy,
    error,
  };
}