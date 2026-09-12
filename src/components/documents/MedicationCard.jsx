export default function MedicationCard({ name, dose }) {
  return <div className="card"><strong>{name}</strong>{dose && <div className="muted">{dose}</div>}</div>;
}