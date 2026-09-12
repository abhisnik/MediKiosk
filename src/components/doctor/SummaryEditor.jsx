import { useEffect, useState } from "react";

export default function SummaryEditor({ summary, onSave }) {
  const [text, setText] = useState("");
  useEffect(() => setText(JSON.stringify(summary, null, 2)), [summary]);
  return <div className="card"><h2 className="section-title">Doctor Review / Edit</h2><textarea className="input" rows="16" value={text} onChange={e=>setText(e.target.value)}/><button className="btn btn-primary" style={{marginTop:12}} onClick={()=>onSave(text)}>Save edits</button></div>;
}