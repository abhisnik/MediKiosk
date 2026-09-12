import { useState } from "react";
import { useNavigate } from "react-router-dom";

import KioskHeader from "../components/kiosk/KioskHeader";
import { savePatient } from "../services/patientService";
import { getSession, saveSession } from "../utils/sessionUtils";
import { translations } from "../utils/i18n";

export default function PatientLogin() {
  const navigate = useNavigate();

  // Get language selected on the previous page
  const session = getSession();
  const [language, setLanguage] = useState(session.language || "en");

  const text = translations[language] || translations.en;

  const [identityNumber, setIdentityNumber] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);

  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  function changeLanguage(event) {
    const newLanguage = event.target.value;

    setLanguage(newLanguage);

    // Keep language for all following pages
    saveSession({
      language: newLanguage,
    });

    setErrors({});
  }

  function validate() {
    const newErrors = {};

    // Aadhaar = 12 digits OR ABHA = 14 digits
    if (!/^\d{12}$|^\d{14}$/.test(identityNumber)) {
      newErrors.identityNumber =
        language === "hi"
          ? "कृपया 12 अंकों का आधार नंबर या 14 अंकों का ABHA नंबर दर्ज करें।"
          : language === "bn"
          ? "12 সংখ্যার আধার বা 14 সংখ্যার ABHA নম্বর লিখুন।"
          : "Enter a valid 12-digit Aadhaar number or 14-digit ABHA number.";
    }

    // Name = letters and spaces only
    if (!/^[\p{L}]+(?:[\s][\p{L}]+)*$/u.test(name.trim())) {
      newErrors.name =
        language === "hi"
          ? "नाम में केवल अक्षर और स्पेस हो सकते हैं।"
          : language === "bn"
          ? "নামে শুধুমাত্র অক্ষর এবং স্পেস থাকতে পারে।"
          : "Name can contain letters and spaces only.";
    }

    // Indian mobile = exactly 10 digits, starts 6-9
    if (!/^[6-9]\d{9}$/.test(phone)) {
      newErrors.phone =
        language === "hi"
          ? "6-9 से शुरू होने वाला 10 अंकों का मोबाइल नंबर दर्ज करें।"
          : language === "bn"
          ? "6-9 দিয়ে শুরু হওয়া 10 সংখ্যার মোবাইল নম্বর লিখুন।"
          : "Enter a valid 10-digit mobile number starting with 6-9.";
    }

    if (!consent) {
      newErrors.consent =
        language === "hi"
          ? "कृपया सहमति दें।"
          : language === "bn"
          ? "অনুগ্রহ করে সম্মতি দিন।"
          : "Please agree to the consent.";
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
        language,
      });

      // Go directly to interview
      navigate("/interview");
    } catch (error) {
      console.error("Patient registration failed:", error);

      setErrors({
        submit:
          language === "hi"
            ? "जानकारी सेव नहीं हो सकी। कृपया पुनः प्रयास करें।"
            : language === "bn"
            ? "তথ্য সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।"
            : "Unable to save patient details. Please try again.",
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

          {/* Header + Language selector */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <h1 className="title">
              {text.patientDetails}
            </h1>

            <select
              value={language}
              onChange={changeLanguage}
              aria-label="Select language"
              style={{
                minWidth: "130px",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #cbd8e5",
                background: "#fff",
                fontSize: "15px",
              }}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="bn">বাংলা</option>
            </select>
          </div>

          <form onSubmit={handleSubmit}>

            {/* ABHA / Aadhaar */}
            <div className="field">
              <label htmlFor="identityNumber">
                {text.identityLabel}
              </label>

              <input
                id="identityNumber"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder={text.identityPlaceholder}
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
                {language === "hi"
                  ? "आधार के लिए 12 अंक या ABHA के लिए 14 अंक दर्ज करें।"
                  : language === "bn"
                  ? "আধারের জন্য 12 সংখ্যা বা ABHA-এর জন্য 14 সংখ্যা লিখুন।"
                  : "Enter 12 digits for Aadhaar or 14 digits for ABHA."}
              </p>

              {errors.identityNumber && (
                <div className="field-error">
                  {errors.identityNumber}
                </div>
              )}
            </div>

            {/* Name */}
            <div className="field">
              <label htmlFor="name">
                {text.name}
              </label>

              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder={text.enterName}
                value={name}
                onChange={(e) => {
                  // Only letters and spaces
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

            {/* Mobile */}
            <div className="field">
              <label htmlFor="phone">
                {text.mobile}
              </label>

              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder={text.enterMobile}
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
                {text.consentCheck}
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
              {busy
                ? language === "hi"
                  ? "सेव हो रहा है..."
                  : language === "bn"
                  ? "সংরক্ষণ করা হচ্ছে..."
                  : "Saving..."
                : text.continue}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}