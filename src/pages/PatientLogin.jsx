import { useState } from "react";
import { useNavigate } from "react-router-dom";

import KioskHeader from "../components/kiosk/KioskHeader";
import Card from "../components/common/Card";

import {
  saveSession,
  getSession
} from "../utils/sessionUtils";

import { t } from "../utils/i18n";

import { savePatient } from "../services/patientService";

export default function PatientLogin() {
  const navigate = useNavigate();

  const session = getSession();

  // Read the language selected on the previous page
  const language = session.language || "en";

  const [identityNumber, setIdentityNumber] = useState("");

  const [name, setName] = useState("");

  const [phone, setPhone] = useState("");

  // Consent checkbox
  const [consent, setConsent] = useState(false);

  async function submit(event) {
    event.preventDefault();

    // Do not continue without consent
    if (!consent) {
      return;
    }

    const patient = {
      identityNumber,
      identityType: "ABHA_OR_AADHAAR",
      name,
      phone
    };

    try {
      await savePatient(patient);

      saveSession({
        patient,
        identityNumber,
        language,
        consent: true
      });

      // Directly go to medical interview
      navigate("/interview");

    } catch (error) {
      console.error(
        "Patient save failed:",
        error
      );

      alert(
        "Unable to save patient information."
      );
    }
  }

  return (
    <div className="app-shell">

      <div className="container">

        <KioskHeader
          title={t(language, "appName")}
        />

        <Card>

          <h1 className="title">
            {t(language, "patientDetails")}
          </h1>

          <form
            className="stack"
            onSubmit={submit}
          >

            {/* ABHA / AADHAAR */}

            <div>

              <label className="label">
                {t(
                  language,
                  "identityLabel"
                )}
              </label>

              <input
                className="input"
                required
                value={identityNumber}
                onChange={(event) =>
                  setIdentityNumber(
                    event.target.value
                  )
                }
                placeholder={t(
                  language,
                  "identityPlaceholder"
                )}
              />

              <p className="muted small">
                {language === "hi"
                  ? "यह पहचान आपके MediKiosk मेडिकल रिकॉर्ड से जुड़ी रहेगी।"
                  : language === "bn"
                  ? "এই পরিচয়টি আপনার MediKiosk চিকিৎসা রেকর্ডের সঙ্গে যুক্ত থাকবে।"
                  : "This identifier will be associated with the patient's MediKiosk medical record."}
              </p>

            </div>

            {/* NAME */}

            <div>

              <label className="label">
                {t(language, "name")}
              </label>

              <input
                className="input"
                required
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                placeholder={t(
                  language,
                  "enterName"
                )}
              />

            </div>

            {/* MOBILE */}

            <div>

              <label className="label">
                {t(language, "mobile")}
              </label>

              <input
                className="input"
                required
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(
                    event.target.value
                  )
                }
                placeholder={t(
                  language,
                  "enterMobile"
                )}
              />

            </div>


            {/* CONSENT CHECKBOX */}

            <div className="consent-check">

              <label className="consent-label">

                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) =>
                    setConsent(
                      event.target.checked
                    )
                  }
                />

                <span>
                  {language === "hi"
                    ? "मैं नियम और शर्तों से सहमत हूँ और रोगी की जानकारी एकत्र करने की अनुमति देता/देती हूँ।"
                    : language === "bn"
                    ? "আমি নিয়ম ও শর্তাবলীতে সম্মত এবং রোগীর তথ্য সংগ্রহের অনুমতি দিচ্ছি।"
                    : "I agree to the Terms & Conditions and consent to the patient intake process."}
                </span>

              </label>

            </div>


            {/* CONTINUE */}

            <button
              className="btn btn-primary"
              type="submit"
              disabled={!consent}
            >
              {t(language, "continue")} →
            </button>

          </form>

        </Card>

      </div>

    </div>
  );
}