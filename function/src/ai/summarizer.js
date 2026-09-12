exports.summarizeCase = async ({ answers = {}, documents = [] }) => ({
  chiefComplaint: answers.chiefComplaint || "Not provided",
  duration: answers.duration || "Not provided",
  severity: answers.severity || "Not provided",
  associatedSymptoms: answers.associated || "Not provided",
  medications: answers.medications || "Not provided",
  allergies: answers.allergies || "Not provided",
  pastHistory: answers.history || "Not provided",
  documentsReviewed: documents.length
});