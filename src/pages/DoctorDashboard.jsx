import { useState } from "react";
import { useNavigate } from "react-router-dom";
import KioskHeader from "../components/kiosk/KioskHeader";
import PatientHeader from "../components/doctor/PatientHeader";
import ClinicalSummary from "../components/doctor/ClinicalSummary";
import RedFlagPanel from "../components/doctor/RedFlagPanel";
import DocumentsPanel from "../components/doctor/DocumentsPanel";
import TimelinePanel from "../components/doctor/TimelinePanel";
import SummaryEditor from "../components/doctor/SummaryEditor";
import ConfirmButton from "../components/doctor/ConfirmButton";
import { demoPatient } from "../data/demoPatient";
import { getSession } from "../utils/sessionUtils";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const session = getSession();
  const [summary, setSummary] = useState(session.summary || {
    chiefComplaint:"Demo patient has reported a health concern.",
    duration:"Not yet provided", severity:"Not yet provided",
    associatedSymptoms:"Not yet provided", currentMedications:demoPatient.medications.join(", "),
    allergies:demoPatient.allergies.join(", "), pastHistory:demoPatient.conditions.join(", ")
  });
  const [confirmed, setConfirmed] = useState(false);
  return <div className="app-shell"><div className="container"><KioskHeader title="MediKiosk Doctor Portal"/>
    <PatientHeader patient={{...demoPatient, ...(session.patient || {})}}/>
    <div className="grid grid-2" style={{marginTop:18}}>
      <div className="stack"><ClinicalSummary summary={summary}/><RedFlagPanel flags={[]}/><DocumentsPanel documents={session.documents || []}/><TimelinePanel timeline={demoPatient.timeline}/></div>
      <div className="stack"><SummaryEditor summary={summary} onSave={text=>{try{setSummary(JSON.parse(text));}catch{alert("Please keep the editor as valid JSON.")}}}/><ConfirmButton onConfirm={()=>setConfirmed(true)}/>{confirmed && <div className="badge badge-green">Summary confirmed by doctor.</div>}</div>
    </div>
    <button className="btn btn-secondary" style={{marginTop:18}} onClick={()=>navigate("/")}>← Exit</button>
  </div></div>;
}