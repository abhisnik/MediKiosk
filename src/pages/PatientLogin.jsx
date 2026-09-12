import { useState } from "react";
import { useNavigate } from "react-router-dom";
import KioskHeader from "../components/kiosk/KioskHeader";
import { savePatient } from "../services/patientService";
import { saveSession } from "../utils/sessionUtils";

export default function PatientLogin() {
  const navigate = useNavigate();

  const [identityNumber, setIdentityNumber] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);

  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  function validate() {
    const newErrors = {};

    // Aadhaar = 12 digits OR ABHA Number = 14 digits
    if (!/^\d{12}$|^\d{14}$/.test(identityNumber)) {
      newErrors.identityNumber =
        "Enter a valid 12-digit Aadhaar number or 14-digit ABHA number.";
    }

    // Name: letters and spaces only
    if (!/^[\p{L}]+(?:[\s][\p{L}]+)*$/u.test(name.trim())) {
      newErrors.name =
        "Name can contain letters and spaces only.";
    }

    // Indian mobile number: exactly 10 digits, starts 6-9
    if (!/^[6-9]\d{9}$/.test(phone)) {
      newErrors.phone =
        "Enter a valid 10-digit mobile number starting with 6-9.";
    }

    if (!consent) {
      newErrors.consent =
        "Please agree to the Terms & Conditions and consent.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setBusy(true);

    try {
      const patient = {
        identityNumber,
        name: name.trim(),
        phone,
      };

      await savePatient(patient);

      saveSession({
        patient,
        identityNumber,
        name: name.trim(),
        phone,
      });

      navigate("/interview");
    } catch (error) {
      console.error("Patient registration failed:", error);

      setErrors({
        submit:
          error.message ||
          "Unable to save patient details. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app-shell">
      <div className="container">
        <KioskHeader />

        <div className="card">
          <h1 className="title">Patient details</h1>

          <form onSubmit={handleSubmit}>

            {/* Identity */}
            <div className="field">
              <label htmlFor="identityNumber">
                ENTER YOUR ABHA ID / AADHAAR NUMBER
              </label>

              <input
                id="identityNumber"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={identityNumber}
                maxLength={14}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 14);

                  setIdentityNumber(value);

                  if (errors.identityNumber) {
                    setErrors((prev) => ({
                      ...prev,
                      identityNumber: "",
                    }));
                  }
                }}
              />

              <p className="muted small">
                Enter 12 digits for Aadhaar or 14 digits for ABHA.
              </p>

              {errors.identityNumber && (
                <div className="field-error">
                  {errors.identityNumber}
                </div>
              )}
            </div>

            {/* Name */}
            <div className="field">
              <label htmlFor="name">Name</label>

              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  // Remove numbers and symbols
                  const value = e.target.value.replace(
                    /[^\p{L}\s]/gu,
                    ""
                  );

                  setName(value);

                  if (errors.name) {
                    setErrors((prev) => ({
                      ...prev,
                      name: "",
                    }));
                  }
                }}
              />

              {errors.name && (
                <div className="field-error">
                  {errors.name}
                </div>
              )}
            </div>

            {/* Phone */}
            <div className="field">
              <label htmlFor="phone">Mobile number</label>

              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={phone}
                maxLength={10}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);

                  setPhone(value);

                  if (errors.phone) {
                    setErrors((prev) => ({
                      ...prev,
                      phone: "",
                    }));
                  }
                }}
              />

              {errors.phone && (
                <div className="field-error">
                  {errors.phone}
                </div>
              )}
            </div>

            {/* Consent */}
            <label className="consent-row">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);

                  if (errors.consent) {
                    setErrors((prev) => ({
                      ...prev,
                      consent: "",
                    }));
                  }
                }}
              />

              <span>
                I agree to the Terms & Conditions and consent
                to the patient intake process.
              </span>
            </label>

            {errors.consent && (
              <div className="field-error">
                {errors.consent}
              </div>
            )}

            {errors.submit && (
              <div className="field-error">
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={busy}
            >
              {busy ? "Saving..." : "Continue →"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}