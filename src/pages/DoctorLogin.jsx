import { useNavigate } from "react-router-dom";
import { useState } from "react";
import KioskHeader from "../components/kiosk/KioskHeader";
import Card from "../components/common/Card";

export default function DoctorLogin() {
  const [id,setId] = useState("");
  const navigate = useNavigate();
  return <div className="app-shell"><div className="container"><KioskHeader title="MediKiosk Doctor Portal"/><Card><h1 className="title">Doctor login</h1><div className="stack"><div><label className="label">Doctor ID</label><input className="input" value={id} onChange={e=>setId(e.target.value)} placeholder="demo-doctor"/></div><button className="btn btn-primary" onClick={()=>navigate("/doctor-dashboard")}>Open dashboard</button></div></Card></div></div>;
}