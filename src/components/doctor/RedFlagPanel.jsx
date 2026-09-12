export default function RedFlagPanel({ flags = [] }) {
  return <div className={`card ${flags.length ? "" : ""}`}><h2 className="section-title">Red Flags</h2>{flags.length ? <ul>{flags.map((f,i)=><li key={i}>{f}</li>)}</ul> : <span className="badge badge-green">No rule-based red flags detected</span>}</div>;
}