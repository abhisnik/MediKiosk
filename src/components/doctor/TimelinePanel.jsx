import MedicalTimeline from "../history/MedicalTimeline";
export default function TimelinePanel({ timeline }) {
  return <div className="card"><h2 className="section-title">Medical Timeline</h2><MedicalTimeline items={timeline}/></div>;
}