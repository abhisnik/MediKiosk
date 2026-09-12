import AudioPrompt from "./AudioPrompt";

export default function QuestionCard({
  question,
  language = "en"
}) {
  const text =
    question?.[language] ||
    question?.en ||
    "";

  return (
    <div className="card">
      <div className="badge">
        AI Medical Interview
      </div>

      <h2 className="section-title">
        {text}
      </h2>

      <AudioPrompt
        text={text}
        language={language}
      />
    </div>
  );
}