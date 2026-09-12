export default function ErrorMessage({ message }) {
  if (!message) return null;
  return <div className="alert" role="alert">{message}</div>;
}