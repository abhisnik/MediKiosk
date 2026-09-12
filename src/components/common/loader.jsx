export default function Loader({ text = "Loading..." }) {
  return <div className="muted" role="status">{text}</div>;
}