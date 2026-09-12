export default function LabResultCard({ test, value, unit }) {
  return <div className="card"><strong>{test}</strong><div>{value} {unit}</div></div>;
}