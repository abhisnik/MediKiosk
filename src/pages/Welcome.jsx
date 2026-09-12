import { useNavigate } from "react-router-dom";
import {
  Mic,
  FileText,
  Stethoscope,
} from "lucide-react";

import KioskHeader from "../components/kiosk/KioskHeader";
import { clearSession } from "../utils/sessionUtils";

export default function Welcome() {
  const navigate = useNavigate();

  function startPatientIntake() {
    // Start a completely fresh patient session.
    // This removes answers and documents from the previous patient.
    clearSession();

    navigate("/language");
  }

  return (
    <div className="app-shell hero">
      <div className="container hero-card">
        <KioskHeader />

        <div className="card">
          <span className="badge badge-green">
            AI-powered clinical history intake
          </span>

          <h1 className="title">
            Welcome to MediKiosk
          </h1>

          <p className="muted">
            Record your symptoms by voice or touch,
            upload previous medical documents, and
            create a structured summary for your doctor.
          </p>

          <div
            className="grid grid-3"
            style={{ margin: "28px 0" }}
          >
            {[
              [Mic, "Voice & Touch"],
              [FileText, "Document OCR"],
              [Stethoscope, "Doctor Summary"],
            ].map(([Icon, text]) => (
              <div
                className="card"
                key={text}
              >
                <Icon size={30} />
                <strong>{text}</strong>
              </div>
            ))}
          </div>

          <button
            className="btn btn-primary"
            onClick={startPatientIntake}
          >
            Start patient intake →
          </button>

          <button
            className="btn btn-secondary"
            style={{ marginLeft: 10 }}
            onClick={() =>
              navigate("/doctor-login")
            }
          >
            Doctor portal
          </button>
        </div>
      </div>
    </div>
  );
}