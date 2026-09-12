export default function DocumentStatus({
  status = "Processed",
  language = "en"
}) {

  const translatedStatus =
    status === "Processed"
      ? language === "hi"
        ? "प्रोसेस किया गया"
        : language === "bn"
        ? "প্রক্রিয়াকরণ সম্পন্ন"
        : "Processed"
      : status;

  return (
    <span className="badge badge-green">
      {translatedStatus}
    </span>
  );
}