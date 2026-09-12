import { HeartPulse } from "lucide-react";

export default function KioskHeader({ title = "MediKiosk" }) {
  return (
    <header className="topbar">
      <div className="logo">
        <span className="logo-mark">
          <HeartPulse size={22} />
        </span>

        {title}
      </div>

      <span className="badge badge-blue">
        Patient Intake
      </span>
    </header>
  );
}