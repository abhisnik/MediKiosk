export default function ConfirmButton({ onConfirm }) {
  return <button className="btn btn-success" onClick={onConfirm}>✓ Confirm clinical summary</button>;
}