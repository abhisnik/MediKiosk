export default function AnswerInput({
  question,
  language = "en",
  value,
  onChange
}) {
  if (question.type === "choice") {

    const options =
      question.options?.[language] ||
      question.options?.en ||
      [];

    return (
      <div>

        {options.map((option) => (
          <button
            type="button"
            key={option}
            className="option"

            style={
              value === option
                ? {
                    borderColor:
                      "var(--primary)",
                    background:
                      "#f7fbff"
                  }
                : {}
            }

            onClick={() =>
              onChange(option)
            }
          >
            {option}
          </button>
        ))}

      </div>
    );
  }

  const placeholder =
    language === "hi"
      ? "अपना उत्तर यहाँ लिखें..."
      : language === "bn"
      ? "আপনার উত্তর এখানে লিখুন..."
      : "Type your answer here...";

  return (
    <textarea
      className="input"
      rows="5"
      value={value || ""}
      onChange={(e) =>
        onChange(e.target.value)
      }
      placeholder={placeholder}
    />
  );
}