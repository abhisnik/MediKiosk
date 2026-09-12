exports.extractFromOCR = async (text = "") => ({
  medications: [],
  labResults: [],
  diagnoses: [],
  dates: [],
  sourceText: text
});