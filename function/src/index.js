const {
  onCall,
  HttpsError
} = require("firebase-functions/v2/https");

const {
  defineSecret
} = require("firebase-functions/params");

const {
  initializeApp
} = require("firebase-admin/app");

const {
  getStorage
} = require("firebase-admin/storage");


initializeApp();


const GEMINI_API_KEY =
  defineSecret("GEMINI_API_KEY");


/*
 * Health check
 */
exports.healthCheck = onCall(() => ({
  ok: true,
  service: "MediKiosk",
  message: "Cloud Functions are connected."
}));


/*
 * AI Medical Document Analyzer
 */
exports.analyzeMedicalDocument = onCall(
  {
    secrets: [GEMINI_API_KEY],
    timeoutSeconds: 120,
    memory: "1GiB"
  },

  async (request) => {
    const {
      storagePath,
      mimeType,
      fileName
    } = request.data || {};

    if (!storagePath) {
      throw new HttpsError(
        "invalid-argument",
        "Medical document storage path is required."
      );
    }

    try {
      /*
       * Get uploaded document from Firebase Storage
       */
      const bucket =
        getStorage().bucket();

      const file =
        bucket.file(storagePath);

      const [fileBuffer] =
        await file.download();


      /*
       * Convert file to base64
       * so Gemini can analyze PDF/image.
       */
      const base64Data =
        fileBuffer.toString("base64");


      /*
       * AI prompt
       */
      const prompt = `
You are the clinical document analysis module
of MediKiosk, a patient history intake system.

Analyze the uploaded medical document carefully.

Do NOT diagnose the patient.

Extract only information that is actually present
in the document.

Identify the most important clinical sections.

Return ONLY valid JSON with this structure:

{
  "documentType": "",
  "mainSections": [
    {
      "section": "",
      "content": ""
    }
  ],
  "keyFindings": [],
  "diagnoses": [],
  "medications": [],
  "labResults": [],
  "dates": [],
  "timeline": [],
  "doctorSummary": ""
}

Possible important sections include:

- Patient information
- Chief complaint
- Diagnosis / impression
- Symptoms
- Clinical findings
- Vital signs
- Laboratory results
- Imaging results
- Medications
- Allergies
- Previous medical history
- Procedures
- Hospitalization
- Doctor recommendations
- Follow-up instructions
- Important dates

Rules:

1. Never invent information.
2. If something is not present, leave it empty.
3. Preserve medical values and units.
4. Preserve dates when visible.
5. Keep medication names and dosage information.
6. Highlight abnormal lab results when clearly marked.
7. Keep the summary concise and useful to a doctor.
8. This is document extraction, not diagnosis.
9. Do not include markdown.
`;


      /*
       * Gemini API
       */
      const model =
        process.env.GEMINI_MODEL ||
        "gemini-3.7-flash";

      const response =
        await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              "x-goog-api-key":
                GEMINI_API_KEY.value()
            },

            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: prompt
                    },
                    {
                      inlineData: {
                        mimeType:
                          mimeType ||
                          "application/pdf",

                        data:
                          base64Data
                      }
                    }
                  ]
                }
              ],

              generationConfig: {
                temperature: 0.1,
                responseMimeType:
                  "application/json"
              }
            })
          }
        );


      if (!response.ok) {
        const errorText =
          await response.text();

        console.error(
          "Gemini API error:",
          errorText
        );

        throw new Error(
          "Gemini document analysis failed."
        );
      }


      const data =
        await response.json();


      const text =
        data
          ?.candidates?.[0]
          ?.content?.parts
          ?.map((part) => part.text || "")
          .join("")
          .trim();


      if (!text) {
        throw new Error(
          "Gemini returned an empty response."
        );
      }


      /*
       * Parse structured JSON
       */
      let analysis;

      try {
        analysis =
          JSON.parse(text);
      } catch (error) {
        console.error(
          "Invalid Gemini JSON:",
          text
        );

        throw new Error(
          "AI returned invalid document data."
        );
      }


      return {
        status: "analyzed",

        fileName:

          fileName || "Medical document",

        documentType:
          analysis.documentType || "Medical document",

        mainSections:
          analysis.mainSections || [],

        keyFindings:
          analysis.keyFindings || [],

        diagnoses:
          analysis.diagnoses || [],

        medications:
          analysis.medications || [],

        labResults:
          analysis.labResults || [],

        dates:
          analysis.dates || [],

        timeline:
          analysis.timeline || [],

        doctorSummary:
          analysis.doctorSummary || ""
      };

    } catch (error) {

      console.error(
        "Medical document analysis error:",
        error
      );

      throw new HttpsError(
        "internal",
        error.message ||
          "Unable to analyze medical document."
      );
    }
  }
);


/*
 * Existing clinical summary function
 */
exports.generateClinicalSummary =
  onCall(
    {
      secrets: [GEMINI_API_KEY]
    },

    async (request) => {

      const {
        answers = {},
        documents = []
      } = request.data || {};

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
  );