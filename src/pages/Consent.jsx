import { useState } from "react";
import { useNavigate } from "react-router-dom";
import KioskHeader from "../components/kiosk/KioskHeader";
import Card from "../components/common/Card";
import { recordConsent } from "../services/consentService";
import { saveSession } from "../utils/sessionUtils";

export default function Consent() {
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();
  async function submit() {
    if (!accepted) return;
    await recordConsent({purpose:"Clinical history intake", accepted:true});
    saveSession({consent:true});
    navigate("/interview");
  }
  return <div className="app-shell"><div className="container"><KioskHeader/><Card><h1 className="title">Consent</h1>
    <p>We will collect the information you provide to prepare your clinical history for the healthcare professional.</p>
    <p className="muted small">For a production deployment, connect this flow to your approved consent and privacy framework. This hackathon MVP records a simple consent event.</p>
    <label className="row" style={{alignItems:"flex-start"}}><input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)}/><span>I understand and consent to this patient-intake process.</span></label>
    <button className="btn btn-primary" disabled={!accepted} style={{marginTop:20}} onClick={submit}>Give consent & continue →</button>
  </Card></div></div>;
}