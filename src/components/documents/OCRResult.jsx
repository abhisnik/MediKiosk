export default function OCRResult({ result }) {
  if (!result) {
    return null;
  }

  const {
    documentType,
    patientInfo,
    mainSections = [],
    keyFindings = [],
    diagnoses = [],
    symptoms = [],
    medications = [],
    labResults = [],
    investigations = [],
    procedures = [],
    allergies = [],
    importantDates = [],
    recommendations = [],
    timeline = [],
    doctorSummary,
  } = result;

  function renderList(items) {
    if (!items || items.length === 0) {
      return (
        <p className="muted small">
          No information found.
        </p>
      );
    }

    return (
      <ul style={{ marginTop: 8 }}>
        {items.map((item, index) => {
          if (typeof item === "string") {
            return <li key={index}>{item}</li>;
          }

          if (typeof item === "object" && item !== null) {
            return (
              <li key={index}>
                {Object.entries(item)
                  .map(([key, value]) => {
                    if (
                      value === null ||
                      value === undefined ||
                      value === ""
                    ) {
                      return null;
                    }

                    const label = key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (char) =>
                        char.toUpperCase()
                      );

                    return `${label}: ${value}`;
                  })
                  .filter(Boolean)
                  .join(" • ")}
              </li>
            );
          }

          return <li key={index}>{String(item)}</li>;
        })}
      </ul>
    );
  }

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ marginBottom: 4 }}>
            🤖 AI Medical Document Analysis
          </h2>

          <p className="muted small">
            Information extracted from the uploaded document.
          </p>
        </div>

        {documentType && (
          <span className="badge">
            📄 {documentType}
          </span>
        )}
      </div>

      {/* Patient information */}
      {patientInfo &&
        Object.keys(patientInfo).length > 0 && (
          <section style={{ marginTop: 20 }}>
            <h3>👤 Patient Information</h3>

            {renderList([patientInfo])}
          </section>
        )}

      {/* Doctor summary */}
      {doctorSummary && (
        <section style={{ marginTop: 20 }}>
          <h3>🩺 Doctor Summary</h3>

          <div
            style={{
              padding: 14,
              borderRadius: 10,
              background: "rgba(0,0,0,0.04)",
              marginTop: 8,
              lineHeight: 1.6,
            }}
          >
            {doctorSummary}
          </div>
        </section>
      )}

      {/* Key findings */}
      <section style={{ marginTop: 20 }}>
        <h3>🔎 Key Findings</h3>
        {renderList(keyFindings)}
      </section>

      {/* Diagnoses */}
      <section style={{ marginTop: 20 }}>
        <h3>🧾 Diagnoses</h3>
        {renderList(diagnoses)}
      </section>

      {/* Symptoms */}
      <section style={{ marginTop: 20 }}>
        <h3>🤒 Symptoms</h3>
        {renderList(symptoms)}
      </section>

      {/* Medications */}
      <section style={{ marginTop: 20 }}>
        <h3>💊 Medications</h3>
        {renderList(medications)}
      </section>

      {/* Lab results */}
      <section style={{ marginTop: 20 }}>
        <h3>🧪 Lab Results</h3>
        {renderList(labResults)}
      </section>

      {/* Investigations */}
      <section style={{ marginTop: 20 }}>
        <h3>🔬 Investigations</h3>
        {renderList(investigations)}
      </section>

      {/* Procedures */}
      <section style={{ marginTop: 20 }}>
        <h3>🏥 Procedures</h3>
        {renderList(procedures)}
      </section>

      {/* Allergies */}
      <section style={{ marginTop: 20 }}>
        <h3>⚠️ Allergies</h3>
        {renderList(allergies)}
      </section>

      {/* Important dates */}
      <section style={{ marginTop: 20 }}>
        <h3>📅 Important Dates</h3>
        {renderList(importantDates)}
      </section>

      {/* Timeline */}
      <section style={{ marginTop: 20 }}>
        <h3>🕒 Medical Timeline</h3>
        {renderList(timeline)}
      </section>

      {/* Main sections */}
      {mainSections.length > 0 && (
        <section style={{ marginTop: 20 }}>
          <h3>📋 Document Sections</h3>
          {renderList(mainSections)}
        </section>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <section style={{ marginTop: 20 }}>
          <h3>💡 Recommendations</h3>
          {renderList(recommendations)}
        </section>
      )}

      <div
        style={{
          marginTop: 24,
          padding: 12,
          borderTop: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <p className="muted small">
          ⚕️ AI-generated document extraction. Doctor
          review and confirmation is required.
        </p>
      </div>
    </div>
  );
}