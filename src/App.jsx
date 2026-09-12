import { Routes, Route, Navigate } from "react-router-dom";

import Welcome from "./pages/Welcome";
import LanguageSelection from "./pages/LanguageSelection";
import PatientLogin from "./pages/PatientLogin";
import Consent from "./pages/Consent";
import Interview from "./pages/Interview";
import DocumentUpload from "./pages/DocumentUpload";
import Review from "./pages/Review";
import Completion from "./pages/Completion";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorDashboard from "./pages/DoctorDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/language" element={<LanguageSelection />} />
      <Route path="/patient-login" element={<PatientLogin />} />
      <Route path="/consent" element={<Consent />} />
      <Route path="/interview" element={<Interview />} />
      <Route path="/documents" element={<DocumentUpload />} />
      <Route path="/review" element={<Review />} />
      <Route path="/completion" element={<Completion />} />

      <Route path="/doctor-login" element={<DoctorLogin />} />
      <Route path="/doctor-dashboard" element={<DoctorDashboard />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;