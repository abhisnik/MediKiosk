import { Upload } from "lucide-react";

export default function DocumentUploader({
  onFile,
  disabled,
  language = "en"
}) {

  const content = {

    en: {
      title: "Upload prescription or medical report",
      description: "PDF, JPG, PNG",
      button: "Choose document"
    },

    hi: {
      title: "प्रिस्क्रिप्शन या मेडिकल रिपोर्ट अपलोड करें",
      description: "PDF, JPG, PNG",
      button: "दस्तावेज़ चुनें"
    },

    bn: {
      title: "প্রেসক্রিপশন বা চিকিৎসার রিপোর্ট আপলোড করুন",
      description: "PDF, JPG, PNG",
      button: "নথি নির্বাচন করুন"
    }

  };

  const text =
    content[language] ||
    content.en;

  return (
    <label
      className="card"
      style={{
        display: "block",
        textAlign: "center",
        cursor: disabled
          ? "not-allowed"
          : "pointer"
      }}
    >

      <Upload size={34} />

      <h3>
        {text.title}
      </h3>

      <p className="muted">
        {text.description}
      </p>

      <span className="btn btn-secondary">
        {text.button}
      </span>

      <input
        hidden
        type="file"
        accept=".pdf,image/*"
        disabled={disabled}
        onChange={(event) => {

          const file =
            event.target.files?.[0];

          if (file) {
            onFile(file);
          }

        }}
      />

    </label>
  );
}