import { useEffect, useRef, useState } from "react";

export default function useSpeech(language = "en") {
  const recognitionRef = useRef(null);

  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    // Support both modern and older Chromium implementations.
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      setError(
        "Speech recognition is not supported in this browser."
      );
      return;
    }

    setSupported(true);

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // Set recognition language.
    if (language === "hi") {
      recognition.lang = "hi-IN";
    } else if (language === "bn") {
      recognition.lang = "bn-IN";
    } else {
      recognition.lang = "en-IN";
    }

    recognition.onstart = () => {
      setListening(true);
      setError("");
      setStatus("Listening...");
    };

    recognition.onspeechstart = () => {
      setStatus("Hearing you...");
    };

    recognition.onspeechend = () => {
      setStatus("Processing your answer...");
    };

    recognition.onresult = (event) => {
      const result =
        event.results?.[0]?.[0]?.transcript || "";

      if (result) {
        setTranscript(result);
        setStatus("Answer captured.");
      }
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error,
        event
      );

      setListening(false);

      switch (event.error) {
        case "not-allowed":
          setError(
            "Microphone permission was denied. Allow microphone access for localhost and try again."
          );
          break;

        case "audio-capture":
          setError(
            "No microphone was detected. Check that your microphone is connected."
          );
          break;

        case "no-speech":
          setError(
            "I couldn't hear anything. Please speak clearly and try again."
          );
          break;

        case "network":
          setError(
            "Speech recognition could not connect to the browser's speech service. Check your internet connection."
          );
          break;

        case "language-not-supported":
          setError(
            "This language is not available for speech recognition in this browser."
          );
          break;

        case "service-not-allowed":
          setError(
            "The browser's speech recognition service is unavailable."
          );
          break;

        default:
          setError(
            `Speech recognition failed: ${event.error || "unknown error"}`
          );
      }

      setStatus("");
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.abort();
      } catch {
        // Ignore cleanup errors.
      }

      recognitionRef.current = null;
    };
  }, [language]);

  function start() {
    const recognition = recognitionRef.current;

    if (!recognition) {
      setError(
        "Speech recognition is not available."
      );
      return;
    }

    if (listening) {
      return;
    }

    setTranscript("");
    setError("");
    setStatus("Starting microphone...");

    try {
      recognition.start();
    } catch (error) {
      console.error(
        "Unable to start speech recognition:",
        error
      );

      setListening(false);

      if (
        error.name === "InvalidStateError"
      ) {
        setError(
          "The microphone is already active. Please wait a moment and try again."
        );
      } else {
        setError(
          "Unable to start the microphone. Please check your browser permissions."
        );
      }
    }
  }

  function stop() {
    const recognition = recognitionRef.current;

    if (!recognition) {
      return;
    }

    try {
      recognition.stop();
    } catch {
      // Ignore if already stopped.
    }

    setListening(false);
  }

  return {
    supported,
    listening,
    transcript,
    error,
    status,
    start,
    stop
  };
}