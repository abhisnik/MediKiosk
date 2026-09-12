// Server-side AI interviewer placeholder.
// Connect your chosen LLM here; keep API keys out of the React frontend.
exports.generateNextQuestion = async ({ history, language }) => ({
  question: language === "hi"
    ? "कृपया अपनी मुख्य समस्या या लक्षण बताएं।"
    : "Please tell me the main problem or symptom bringing you to the clinic.",
  history
});