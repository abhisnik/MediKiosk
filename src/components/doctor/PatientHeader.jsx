export default function PatientHeader({ patient }) {
  return <div className="card"><div className="row space-between"><div><h2 style={{margin:"0 0 5px"}}>{patient?.name || "Patient"}</h2><div className="muted">{patient?.age || "-"} years • {patient?.gender || "-"}</div></div><span className="badge badge-blue">ABHA: {patient?.abha || "Demo"}</span></div></div>;
}