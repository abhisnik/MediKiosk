export default function MedicalTimeline({ items = [] }) {
  return <div className="stack">{items.map((item,i)=><div className="card" key={i}><span className="badge badge-blue">{item.date}</span><h3>{item.title}</h3><p className="muted">{item.detail}</p></div>)}</div>;
}