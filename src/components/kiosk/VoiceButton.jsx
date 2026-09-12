import { Mic, Square } from "lucide-react";

export default function VoiceButton({
  listening,
  supported,
  error,
  status,
  start,
  stop
}) {
  if (!supported) {
    return (
      <div className="stack">
        <button
          type="button"
          className="btn btn-secondary"
          disabled
        >
          <Mic size={18} />
          Voice unavailable
        </button>

        {error && (
          <div className="field-error">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="stack">
      <button
        type="button"
        className={`btn ${
          listening ? "btn-danger" : "btn-secondary"
        }`}
        onClick={listening ? stop : start}
      >
        {listening ? (
          <Square size={18} />
        ) : (
          <Mic size={18} />
        )}

        {listening
          ? "Stop listening"
          : "Answer by voice"}
      </button>

      {status && (
        <div className="muted small">
          {status}
        </div>
      )}

      {error && (
        <div className="field-error">
          {error}
        </div>
      )}
    </div>
  );
}