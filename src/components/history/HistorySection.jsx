export default function HistorySection({ title, children }) {
  return <section className="stack"><h2 className="section-title">{title}</h2>{children}</section>;
}