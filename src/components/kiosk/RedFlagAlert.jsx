export default function RedFlagAlert({ flags }) {
  if (!flags?.length) return null;
  return <div className="alert"><strong>Priority alert:</strong><ul>{flags.map((f,i)=><li key={i}>{f}</li>)}</ul><div className="small">This is a screening signal for clinical attention, not a diagnosis.</div></div>;
}