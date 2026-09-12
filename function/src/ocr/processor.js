exports.processOCR = async ({ text = "" }) => ({
  rawText: text,
  status: "processed"
});