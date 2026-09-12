import { useNavigate } from "react-router-dom";
import KioskHeader from "../components/kiosk/KioskHeader";
import DocumentUploader from "../components/documents/DocumentUploader";
import DocumentPreview from "../components/documents/DocumentPreview";
import OCRResult from "../components/documents/OCRResult";
import DocumentStatus from "../components/documents/DocumentStatus";
import useDocuments from "../hooks/useDocuments";

export default function DocumentUpload() {
  const navigate = useNavigate();

  const {
    documents,
    addDocument,
    busy,
    error,
  } = useDocuments();

  async function handleFile(file) {
    try {
      await addDocument(file);
    } catch (err) {
      // Error is already displayed below.
    }
  }

  return (
    <div className="app-shell">
      <div className="container">
        <KioskHeader />

        <div className="card">
          <h1 className="title">
            Your medical documents
          </h1>

          <p className="muted">
            Upload prescriptions, lab reports or discharge
            summaries. AI will analyze the document and extract
            important medical information.
          </p>

          <DocumentUploader
            onFile={handleFile}
            disabled={busy}
          />

          {busy && (
            <div
              className="card"
              style={{
                marginTop: 16,
                textAlign: "center",
              }}
            >
              <strong>
                🤖 AI is analyzing your document...
              </strong>

              <p className="muted small">
                Please wait. This may take a few seconds.
              </p>
            </div>
          )}

          {error && (
            <div
              className="field-error"
              style={{ marginTop: 16 }}
            >
              {error}
            </div>
          )}
        </div>

        <div
          className="stack"
          style={{ marginTop: 18 }}
        >
          {documents.map((doc, index) => (
            <div key={`${doc.name}-${index}`}>
              <DocumentPreview document={doc} />

              <div style={{ marginTop: 8 }}>
                <DocumentStatus />

                <OCRResult
                  result={doc.analysis}
                />
              </div>
            </div>
          ))}
        </div>

        <div
          className="row"
          style={{ marginTop: 18 }}
        >
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/interview")}
            disabled={busy}
          >
            ← Back
          </button>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/review")}
            disabled={busy}
          >
            Review my information →
          </button>
        </div>
      </div>
    </div>
  );
}