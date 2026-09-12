export function buildClinicalSummary(
  answers = {},
  documents = []
) {

  return {

    chiefComplaint:
      answers.chiefComplaint ||
      "Not provided",

    duration:
      answers.duration ||
      "Not provided",

    severity:
      answers.severity ||
      "Not provided",

    associatedSymptoms:
      answers.associated ||
      "Not provided",

    currentMedications:
      answers.medications ||
      "Not provided",

    allergies:
      answers.allergies ||
      "Not provided",

    pastHistory:
      answers.history ||
      "Not provided",

    documentsReviewed:
      documents.length,

    documentInsights:
      documents.map(
        (document) =>
          document.analysis || {}
      ),

    disclaimer:
      "AI-generated draft. Doctor review and confirmation required."
  };
}