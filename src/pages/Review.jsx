import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import KioskHeader from "../components/kiosk/KioskHeader";
import ClinicalSummary from "../components/doctor/ClinicalSummary";

import { generateSummary } from "../services/summaryService";
import {
  getSession,
  saveSession
} from "../utils/sessionUtils";


export default function Review() {
  const navigate = useNavigate();

  const [
    summary,
    setSummary
  ] = useState(null);

  const [
    error,
    setError
  ] = useState("");

  useEffect(() => {

    async function prepareSummary() {

      try {
        const session =
          getSession();

        console.log(
          "Review session:",
          session
        );

        const result =
          await generateSummary(
            session.answers || {},
            session.documents || []
          );

        setSummary(result);

        saveSession({
          summary: result
        });

      } catch (error) {

        console.error(
          "Summary generation failed:",
          error
        );

        setError(
          "Unable to prepare the clinical summary."
        );
      }
    }

    prepareSummary();

  }, []);


  if (error) {
    return (
      <div className="app-shell">
        <div className="container">

          <KioskHeader />

          <div className="card">

            <h2>
              Something went wrong
            </h2>

            <p className="field-error">
              {error}
            </p>

            <button
              className="btn btn-secondary"
              onClick={() =>
                navigate("/documents")
              }
            >
              ← Back to documents
            </button>

          </div>

        </div>
      </div>
    );
  }


  if (!summary) {
    return (
      <div className="app-shell">
        <div className="container">

          <KioskHeader />

          <div className="card">

            <h2>
              Preparing clinical summary...
            </h2>

            <p className="muted">
              AI is reviewing your medical
              documents and patient history.
            </p>

          </div>

        </div>
      </div>
    );
  }


  return (
    <div className="app-shell">

      <div className="container">

        <KioskHeader />

        <ClinicalSummary
          summary={summary}
        />

        <div
          className="card"
          style={{
            marginTop: 18
          }}
        >

          <p className="muted small">
            {summary.disclaimer}
          </p>

          <button
            className="btn btn-primary"
            onClick={() => {

              saveSession({
                summary
              });

              navigate(
                "/completion"
              );

            }}
          >
            Confirm & finish →
          </button>

        </div>

      </div>

    </div>
  );
}