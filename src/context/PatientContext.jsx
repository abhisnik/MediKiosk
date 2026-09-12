import { createContext, useContext, useMemo, useState } from "react";
import { getSession, saveSession } from "../utils/sessionUtils";

const PatientContext = createContext(null);

export function PatientProvider({ children }) {
  const initial = getSession();
  const [patient, setPatientState] = useState(initial);

  const setPatient = data => {
    const next = saveSession(data);
    setPatientState(next);
  };

  const value = useMemo(() => ({ patient, setPatient }), [patient]);
  return <PatientContext.Provider value={value}>{children}</PatientContext.Provider>;
}

export function usePatientContext() {
  return useContext(PatientContext);
}