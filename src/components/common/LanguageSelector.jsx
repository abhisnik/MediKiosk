import { languages } from "../../data/languages";

export default function LanguageSelector({
  value,
  onChange
}) {
  return (
    <div className="grid grid-2">
      {languages.map((language) => (
        <button
          type="button"
          key={language.code}
          className="option"
          onClick={() => onChange(language.code)}
          style={
            value === language.code
              ? {
                  borderColor: "var(--primary)",
                  background: "#f7fbff"
                }
              : {}
          }
        >
          <strong>{language.native}</strong>

          <div className="muted small">
            {language.name}
          </div>
        </button>
      ))}
    </div>
  );
}