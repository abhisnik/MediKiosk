export default function DocumentsPanel({ documents = [] }) {
  return <div className="card"><h2 className="section-title">Documents</h2>{documents.length ? documents.map((d,i)=><div key={i} style={{padding:"10px 0", borderBottom:"1px solid var(--border)"}}><strong>{d.name}</strong><div className="muted small">{d.ocr?.text}</div></div>) : <p className="muted">No documents uploaded.</p>}</div>;
}