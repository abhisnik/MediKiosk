import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import KioskHeader from "../components/kiosk/KioskHeader";
import Card from "../components/common/Card";

export default function Completion() {
  const navigate = useNavigate();
  return <div className="app-shell hero"><div className="container hero-card"><KioskHeader/><Card><CheckCircle2 size={60}/><h1 className="title">Thank you</h1><p className="muted">Your clinical history has been prepared for doctor review.</p><p className="small muted">MediKiosk does not replace a clinician's assessment or diagnosis.</p><button className="btn btn-primary" onClick={()=>navigate("/")}>Return home</button></Card></div></div>;
}