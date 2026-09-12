export default function MedicationList({ items = [] }) {
  return <ul>{items.map((item,i)=><li key={i}>{item}</li>)}</ul>;
}