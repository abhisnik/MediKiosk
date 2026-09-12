exports.transcribe = async ({ audioUrl }) => ({
  audioUrl,
  transcript: "",
  note: "Connect an ASR provider here."
});