export default function InvestigationList({ items = [] }) {
  return <ul>{items.map((item,i)=><li key={i}>{item}</li>)}</ul>;
}