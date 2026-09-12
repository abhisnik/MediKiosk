exports.toFHIRBundle = ({ patient = {}, summary = {} }) => ({
  resourceType: "Bundle",
  type: "collection",
  entry: [
    { resource: { resourceType: "Patient", id: patient.id || "demo-patient", name: [{ text: patient.name || "Demo Patient" }] } },
    { resource: { resourceType: "Condition", code: { text: summary.chiefComplaint || "Clinical concern" } } }
  ]
});