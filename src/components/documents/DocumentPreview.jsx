export default function DocumentPreview({
  document,
  language = "en"
}) {

  const sizeText =
    language === "hi"
      ? "आकार"
      : language === "bn"
      ? "আকার"
      : "Size";

  return (
    <div className="card">

      <strong>
        {document.name}
      </strong>

      <div className="muted small">
        {sizeText}:{" "}
        {Math.round(
          (document.size || 0) / 1024
        )} KB
      </div>

    </div>
  );
}