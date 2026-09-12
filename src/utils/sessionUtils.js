export const SESSION_KEY = "medikiosk_session";

export function getSession() {
  try {
    const saved = localStorage.getItem(
      SESSION_KEY
    );

    if (!saved) {
      return {};
    }

    return JSON.parse(saved);

  } catch (error) {
    console.error(
      "Unable to read MediKiosk session:",
      error
    );

    return {};
  }
}


export function saveSession(data) {
  const currentSession = getSession();

  const updatedSession = {
    ...currentSession,
    ...data,
  };

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify(updatedSession)
  );

  return updatedSession;
}


export function clearSession() {
  localStorage.removeItem(
    SESSION_KEY
  );
}