exports.extractClinicalEntities = async (text = "") => ({
  symptoms: [],
  medications: [],
  diagnoses: [],
  investigations: [],
  dates: [],
  sourceText: text
});