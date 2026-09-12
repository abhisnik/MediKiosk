// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// import Card from "../components/common/Card";
// import LanguageSelector from "../components/common/LanguageSelector";
// import KioskHeader from "../components/kiosk/KioskHeader";

// import {
//   saveSession,
//   getSession
// } from "../utils/sessionUtils";

// import { t } from "../utils/i18n";

// export default function LanguageSelection() {
//   const navigate = useNavigate();

//   const existingSession = getSession();

//   const [language, setLanguage] = useState(
//     existingSession.language || "en"
//   );

//   function selectLanguage(code) {
//     setLanguage(code);

//     // Immediately remember the selected language.
//     saveSession({
//       language: code
//     });
//   }

//   function continueToPatientDetails() {
//     // Save one more time before navigation.
//     saveSession({
//       language
//     });

//     navigate("/patient-login");
//   }

//   return (
//     <div className="app-shell">
//       <div className="container">

//         <KioskHeader
//           title={t(language, "appName")}
//         />

//         <Card>

//           <h1 className="title">
//             {t(language, "chooseLanguage")}
//           </h1>

//           <p className="muted">
//             {t(language, "languageDescription")}
//           </p>

//           <LanguageSelector
//             value={language}
//             onChange={selectLanguage}
//           />

//           <button
//             type="button"
//             className="btn btn-primary"
//             style={{ marginTop: 20 }}
//             onClick={continueToPatientDetails}
//           >
//             {t(language, "continue")}
//           </button>

//         </Card>

//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../components/common/Card";
import LanguageSelector from "../components/common/LanguageSelector";
import KioskHeader from "../components/kiosk/KioskHeader";

import {
  saveSession,
  getSession
} from "../utils/sessionUtils";

import { t } from "../utils/i18n";

export default function LanguageSelection() {
  const navigate = useNavigate();

  const existingSession = getSession();

  const [language, setLanguage] = useState(
    existingSession.language || "en"
  );

  function selectLanguage(code) {
    setLanguage(code);

    // Immediately save selected language
    saveSession({
      language: code
    });
  }

  function handleOtherLanguage(e) {
    const code = e.target.value;

    if (!code) return;

    selectLanguage(code);
  }

  function continueToPatientDetails() {
    // Save language before navigation
    saveSession({
      language
    });

    navigate("/patient-login");
  }

  return (
    <div className="app-shell">
      <div className="container">

        {/* Header */}
        <KioskHeader
          title={t(language, "appName")}
        />

        <Card>

          {/* Page Title */}
          <h1 className="title">
            {t(language, "chooseLanguage")}
          </h1>

          <p className="muted">
            {t(language, "languageDescription")}
          </p>

          {/* Existing Languages
              English / Hindi / Bengali
          */}
          <LanguageSelector
            value={language}
            onChange={selectLanguage}
          />

          {/* OTHER LANGUAGE DROPDOWN */}
          <div
            style={{
              marginTop: 18,
              border: "1px solid #d8dfe5",
              borderRadius: 12,
              padding: "14px 16px",
              maxWidth: 450
            }}
          >

            <label
              htmlFor="other-language"
              style={{
                display: "block",
                fontSize: 17,
                fontWeight: 700,
                marginBottom: 8
              }}
            >
              Other
            </label>

            <select
              id="other-language"
              value={
                ["ta", "te", "mr", "pa"].includes(language)
                  ? language
                  : ""
              }
              onChange={handleOtherLanguage}
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1px solid #cbd5df",
                borderRadius: 8,
                fontSize: 15,
                background: "#fff",
                cursor: "pointer",
                outline: "none"
              }}
            >

              <option value="" disabled>
                Select language
              </option>

              <option value="ta">
                தமிழ் — Tamil
              </option>

              <option value="te">
                తెలుగు — Telugu
              </option>

              <option value="mr">
                मराठी — Marathi
              </option>

              <option value="pa">
                ਪੰਜਾਬੀ — Punjabi
              </option>

            </select>

          </div>

          {/* Continue Button */}
          <button
            type="button"
            className="btn btn-primary"
            style={{
              marginTop: 20
            }}
            onClick={continueToPatientDetails}
          >
            {t(language, "continue")} →
          </button>

        </Card>

      </div>
    </div>
  );
}