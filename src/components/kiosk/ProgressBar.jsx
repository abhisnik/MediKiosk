export default function ProgressBar({
  current,
  total,
  language = "en"
}) {
  const percent = Math.round(
    (current / total) * 100
  );

  const questionText =
    language === "hi"
      ? "प्रश्न"
      : language === "bn"
      ? "প্রশ্ন"
      : "Question";

  return (
    <div>

      <div className="progress">
        <div
          style={{
            width: `${percent}%`
          }}
        />
      </div>

      <div
        className="muted small"
        style={{ marginTop: 6 }}
      >
        {questionText} {current} / {total}
      </div>

    </div>
  );
}