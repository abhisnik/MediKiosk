import { useEffect, useState } from "react";
import { Volume2, Square } from "lucide-react";

export default function AudioPrompt({ text, language = "en" }) {
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    const synth = window.speechSynthesis;

    function loadVoices() {
      setVoices(synth.getVoices());
    }

    loadVoices();

    synth.addEventListener("voiceschanged", loadVoices);

    return () => {
      synth.removeEventListener("voiceschanged", loadVoices);
      synth.cancel();
    };
  }, []);

  function getLanguageCode() {
    if (language === "hi") return "hi-IN";
    if (language === "bn") return "bn-IN";
    return "en-IN";
  }

  function findVoice(languageCode) {
    if (!voices.length) return null;

    const exact = voices.find(
      (voice) =>
        voice.lang.toLowerCase() ===
        languageCode.toLowerCase()
    );

    if (exact) return exact;

    const languagePrefix = languageCode
      .split("-")[0]
      .toLowerCase();

    return (
      voices.find((voice) =>
        voice.lang
          .toLowerCase()
          .startsWith(languagePrefix)
      ) || null
    );
  }

  function speakQuestion() {
    if (!("speechSynthesis" in window)) {
      alert(
        "Text-to-speech is not supported in this browser."
      );
      return;
    }

    if (!text || !text.trim()) {
      return;
    }

    const synth = window.speechSynthesis;

    // Stop anything already speaking.
    synth.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    const languageCode = getLanguageCode();

    utterance.lang = languageCode;

    const selectedVoice =
      findVoice(languageCode);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setSpeaking(true);
    };

    utterance.onend = () => {
      setSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error(
        "Text-to-speech error:",
        event
      );
      setSpeaking(false);
    };

    synth.speak(utterance);

    // Some browsers can leave speech synthesis paused.
    if (synth.paused) {
      synth.resume();
    }
  }

  function stopSpeaking() {
    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  if (!("speechSynthesis" in window)) {
    return (
      <div className="muted small">
        Text-to-speech is not available in this browser.
      </div>
    );
  }

  return (
    <div className="stack">
      <button
        type="button"
        className={`btn ${
          speaking
            ? "btn-danger"
            : "btn-secondary"
        }`}
        onClick={
          speaking
            ? stopSpeaking
            : speakQuestion
        }
      >
        {speaking ? (
          <Square size={18} />
        ) : (
          <Volume2 size={18} />
        )}

        {speaking
          ? language === "hi"
            ? "बोलना बंद करें"
            : language === "bn"
            ? "বলা বন্ধ করুন"
            : "Stop speaking"
          : language === "hi"
          ? "प्रश्न सुनें"
          : language === "bn"
          ? "প্রশ্ন শুনুন"
          : "Hear question"}
      </button>

      {speaking && (
        <div className="muted small">
          {language === "hi"
            ? "प्रश्न पढ़ा जा रहा है..."
            : language === "bn"
            ? "প্রশ্নটি পড়া হচ্ছে..."
            : "Reading the question..."}
        </div>
      )}
    </div>
  );
}