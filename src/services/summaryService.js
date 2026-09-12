import {
  buildClinicalSummary
} from "../utils/medicalUtils";


export async function generateSummary(
  answers,
  documents
) {

  const summary =
    buildClinicalSummary(
      answers,
      documents
    );

  return summary;
}