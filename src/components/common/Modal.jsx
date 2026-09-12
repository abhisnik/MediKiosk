export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,.35)", display:"grid", placeItems:"center", padding:20, zIndex:10}}>
      <div className="card" style={{maxWidth:520, width:"100%"}}>
        <div className="row space-between"><h3>{title}</h3><button className="btn btn-secondary" onClick={onClose}>Close</button></div>
        {children}
      </div>
    </div>
  );
}