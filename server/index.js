import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error(
    "❌ GEMINI_API_KEY is missing from server/.env"
  );

  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});


/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://medikiosksih-1.onrender.com",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked CORS origin:", origin);
      return callback(null, false);
    },
  })
);


/*
|--------------------------------------------------------------------------
| Upload configuration
|--------------------------------------------------------------------------
*/

const uploadDirectory = path.join(
  process.cwd(),
  "uploads"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    );

    cb(
      null,
      `${Date.now()}-${safeName}`
    );
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 50 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only PDF, JPG, PNG and WEBP medical documents are supported."
        )
      );
    }
  },
});


/*
|--------------------------------------------------------------------------
| Health check
|--------------------------------------------------------------------------
*/

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "MediKiosk AI Server",
    gemini: true,
  });
});


/*
|--------------------------------------------------------------------------
| Gemini AI helper
|--------------------------------------------------------------------------
*/

async function analyzeWithGemini(
  prompt,
  mimeType,
  base64Data
) {
  /*
   * Try newer Gemini models.
   *
   * If one is temporarily unavailable,
   * automatically try the next model.
   */

  const models = [
    "gemini-3.6-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.5-flash",
  ];

  let lastError = null;

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(
          `🤖 Trying ${model} (attempt ${attempt})...`
        );

        const response =
          await ai.models.generateContent({
            model,

            contents: [
              {
                role: "user",

                parts: [
                  {
                    text: prompt,
                  },

                  {
                    inlineData: {
                      mimeType,
                      data: base64Data,
                    },
                  },
                ],
              },
            ],

            config: {
              responseMimeType:
                "application/json",
            },
          });

        console.log(
          `✅ ${model} responded successfully.`
        );

        return response;

      } catch (error) {
        lastError = error;

        console.error(
          `⚠️ ${model} failed on attempt ${attempt}:`
        );

        console.error(
          error?.message || error
        );

        /*
         * Wait before retrying.
         */

        if (attempt < 2) {
          await new Promise((resolve) =>
            setTimeout(resolve, 2000)
          );
        }
      }
    }

    console.log(
      `➡️ Moving to next Gemini model...`
    );
  }

  throw (
    lastError ||
    new Error(
      "All Gemini models are currently unavailable."
    )
  );
}


/*
|--------------------------------------------------------------------------
| Analyze medical document
|--------------------------------------------------------------------------
*/

app.post(
  "/api/analyze-document",
  upload.single("document"),

  async (req, res) => {
    let uploadedFilePath = null;

    try {

      /*
      |--------------------------------------------------------------------------
      | Check upload
      |--------------------------------------------------------------------------
      */

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error:
            "No medical document was uploaded.",
        });
      }

      uploadedFilePath = req.file.path;

      console.log("");
      console.log(
        "======================================"
      );
      console.log(
        "📄 New medical document received"
      );
      console.log(
        `📄 File: ${req.file.originalname}`
      );
      console.log(
        `📄 Type: ${req.file.mimetype}`
      );
      console.log(
        `📄 Size: ${Math.round(
          req.file.size / 1024
        )} KB`
      );
      console.log(
        "======================================"
      );


      /*
      |--------------------------------------------------------------------------
      | Read document
      |--------------------------------------------------------------------------
      */

      const fileBuffer =
        fs.readFileSync(
          uploadedFilePath
        );

      const base64Data =
        fileBuffer.toString(
          "base64"
        );


      /*
      |--------------------------------------------------------------------------
      | Medical extraction prompt
      |--------------------------------------------------------------------------
      */

      const prompt = `
You are the clinical document intelligence engine
inside MediKiosk.

Your task is to analyze a medical document and convert
it into a concise, structured, doctor-friendly clinical
summary.

This is NOT a simple OCR task.

You must understand the medical meaning and organization
of the information present in the document.

IMPORTANT:

- Do not merely copy the document text.
- Do not reproduce large paragraphs from the document.
- Do not repeat the same information in multiple fields.
- Extract only clinically relevant information.
- Combine related information into concise points.
- Preserve important numerical values, units, medicine names,
  dosages, dates and abnormal findings.
- Do not invent information.
- Do not make a diagnosis that is not explicitly stated
  in the document.
- Do not provide new treatment advice.

The output will be shown to a doctor before consultation.

Return ONLY valid JSON.

Use exactly this structure:

{
  "documentType": "",

  "patientInfo": {
    "name": "",
    "age": "",
    "gender": ""
  },

  "keyFindings": [],

  "diagnoses": [],

  "symptoms": [],

  "medications": [],

  "labResults": [],

  "investigations": [],

  "procedures": [],

  "allergies": [],

  "importantDates": [],

  "recommendations": [],

  "timeline": [],

  "doctorSummary": ""
}

FIELD INSTRUCTIONS:

documentType:
Identify the type of document.

Examples:
- Blood Test Report
- Prescription
- Discharge Summary
- Radiology Report
- Pathology Report
- Consultation Note

patientInfo:
Extract patient details only if explicitly present.

keyFindings:
Extract the most clinically important findings.

Do NOT copy entire sentences or paragraphs.

Use short, meaningful points.

For example:

[
  "Hemoglobin: 11.2 g/dL",
  "Blood glucose: 126 mg/dL",
  "WBC count: 8,400 /µL"
]

diagnoses:
Only include diagnoses explicitly mentioned
in the document.

Do NOT infer a diagnosis from a laboratory value.

symptoms:
Extract symptoms explicitly documented.

medications:
Extract medicine name, dose, frequency and duration
when available.

For example:

[
  "Paracetamol 500 mg - twice daily",
  "Amoxicillin 500 mg - three times daily for 5 days"
]

labResults:
Extract important laboratory results.

Preserve:
- test name
- value
- unit
- reference range when available
- abnormal/high/low status when explicitly indicated

Do not copy the entire laboratory table.

Example:

[
  {
    "test": "Hemoglobin",
    "value": "11.2",
    "unit": "g/dL",
    "status": "Low"
  }
]

investigations:
Include investigations such as:
- CBC
- LFT
- KFT
- X-ray
- MRI
- CT
- Ultrasound
- ECG

procedures:
Extract documented procedures or surgeries.

allergies:
Extract explicitly documented allergies.

importantDates:
Extract clinically relevant dates such as:
- consultation date
- admission date
- discharge date
- investigation date
- surgery date
- follow-up date

recommendations:
Extract recommendations or follow-up instructions
that are explicitly written in the document.

Do not create new medical advice.

timeline:
Create a short chronological timeline when dates
and events are available.

Example:

[
  "10 Sep 2026 - Blood investigation performed",
  "12 Sep 2026 - Follow-up advised"
]

doctorSummary:

THIS IS THE MOST IMPORTANT FIELD.

Create a concise clinical summary for a doctor.

Do NOT copy the document.

Summarize the important information in approximately
3-6 sentences.

The summary should answer:

1. What type of medical document is this?
2. What important clinical information does it contain?
3. What abnormal or significant findings are present?
4. What medications, diagnoses or investigations are relevant?
5. What follow-up/recommendation is explicitly mentioned?

Example style:

"Blood investigation report showing hemoglobin of
11.2 g/dL, which is marked low in the report. WBC count
is 8,400/µL. Blood glucose is 126 mg/dL and is marked
high. No medication or diagnosis information is provided
in this report."

Do NOT say that the patient has a disease unless that
diagnosis is explicitly stated in the document.

If the document contains insufficient clinical information,
say so briefly rather than inventing information.

GENERAL RULES:

1. Never invent a value.
2. Never invent a diagnosis.
3. Never invent a medication.
4. Never invent a symptom.
5. Never invent a recommendation.
6. Preserve numerical medical values accurately.
7. Preserve units.
8. Preserve medication dosage and frequency.
9. Preserve clinically important dates.
10. Avoid unnecessary document text.
11. Avoid repeating information.
12. Summarize instead of copying.
13. Keep the doctorSummary concise.
14. The output is an AI-generated draft.
15. Doctor review and confirmation are required.
`;


      /*
      |--------------------------------------------------------------------------
      | Send document to Gemini
      |--------------------------------------------------------------------------
      */

      console.log(
        "🧠 Sending document to Gemini..."
      );

      const response =
        await analyzeWithGemini(
          prompt,
          req.file.mimetype,
          base64Data
        );


      /*
      |--------------------------------------------------------------------------
      | Get Gemini response
      |--------------------------------------------------------------------------
      */

      const responseText =
        response.text;

      if (!responseText) {
        throw new Error(
          "Gemini returned an empty response."
        );
      }

      console.log(
        "🤖 Gemini response received"
      );


      /*
      |--------------------------------------------------------------------------
      | Parse JSON
      |--------------------------------------------------------------------------
      */

      let analysis;

      try {
        analysis =
          JSON.parse(
            responseText
          );

      } catch (parseError) {

        console.error(
          "❌ Gemini returned invalid JSON:"
        );

        console.error(
          responseText
        );

        throw new Error(
          "AI returned invalid structured data."
        );
      }


      /*
      |--------------------------------------------------------------------------
      | Normalize response
      |--------------------------------------------------------------------------
      */

      const normalizedAnalysis = {

        documentType:
          analysis.documentType ||
          "Medical document",

        patientInfo:
          analysis.patientInfo ||
          {},

        mainSections:
          Array.isArray(
            analysis.mainSections
          )
            ? analysis.mainSections
            : [],

        keyFindings:
          Array.isArray(
            analysis.keyFindings
          )
            ? analysis.keyFindings
            : [],

        diagnoses:
          Array.isArray(
            analysis.diagnoses
          )
            ? analysis.diagnoses
            : [],

        symptoms:
          Array.isArray(
            analysis.symptoms
          )
            ? analysis.symptoms
            : [],

        medications:
          Array.isArray(
            analysis.medications
          )
            ? analysis.medications
            : [],

        labResults:
          Array.isArray(
            analysis.labResults
          )
            ? analysis.labResults
            : [],

        investigations:
          Array.isArray(
            analysis.investigations
          )
            ? analysis.investigations
            : [],

        procedures:
          Array.isArray(
            analysis.procedures
          )
            ? analysis.procedures
            : [],

        allergies:
          Array.isArray(
            analysis.allergies
          )
            ? analysis.allergies
            : [],

        importantDates:
          Array.isArray(
            analysis.importantDates
          )
            ? analysis.importantDates
            : [],

        recommendations:
          Array.isArray(
            analysis.recommendations
          )
            ? analysis.recommendations
            : [],

        timeline:
          Array.isArray(
            analysis.timeline
          )
            ? analysis.timeline
            : [],

        doctorSummary:
          analysis.doctorSummary ||
          "",
      };


      /*
      |--------------------------------------------------------------------------
      | Log successful analysis
      |--------------------------------------------------------------------------
      */

      console.log(
        "✅ Medical document analysis completed"
      );

      console.log(
        `📋 Document type: ${normalizedAnalysis.documentType}`
      );

      console.log(
        `🔎 Key findings: ${normalizedAnalysis.keyFindings.length}`
      );

      console.log(
        `💊 Medications: ${normalizedAnalysis.medications.length}`
      );

      console.log(
        `🧪 Lab results: ${normalizedAnalysis.labResults.length}`
      );

      console.log(
        `🩺 Diagnoses: ${normalizedAnalysis.diagnoses.length}`
      );

      console.log(
        "======================================"
      );

      console.log("");


      /*
      |--------------------------------------------------------------------------
      | Return structured analysis
      |--------------------------------------------------------------------------
      */

      return res.json({

        success: true,

        fileName:
          req.file.originalname,

        documentType:
          normalizedAnalysis.documentType,

        patientInfo:
          normalizedAnalysis.patientInfo,

        mainSections:
          normalizedAnalysis.mainSections,

        keyFindings:
          normalizedAnalysis.keyFindings,

        diagnoses:
          normalizedAnalysis.diagnoses,

        symptoms:
          normalizedAnalysis.symptoms,

        medications:
          normalizedAnalysis.medications,

        labResults:
          normalizedAnalysis.labResults,

        investigations:
          normalizedAnalysis.investigations,

        procedures:
          normalizedAnalysis.procedures,

        allergies:
          normalizedAnalysis.allergies,

        importantDates:
          normalizedAnalysis.importantDates,

        recommendations:
          normalizedAnalysis.recommendations,

        timeline:
          normalizedAnalysis.timeline,

        doctorSummary:
          normalizedAnalysis.doctorSummary,

        disclaimer:
          "AI-generated document extraction. Doctor review and confirmation required.",
      });

    } catch (error) {

      console.error("");
      console.error(
        "❌ Medical document analysis failed:"
      );

      console.error(
        error?.message || error
      );


      /*
      |--------------------------------------------------------------------------
      | Friendly error messages
      |--------------------------------------------------------------------------
      */

      const errorMessage =
        error?.message || "";

      let userMessage =
        "Unable to analyze medical document.";

      if (
        errorMessage.includes("503") ||
        errorMessage
          .toLowerCase()
          .includes("unavailable") ||
        errorMessage
          .toLowerCase()
          .includes("high demand")
      ) {
        userMessage =
          "The AI service is temporarily busy. Please try uploading the document again in a few seconds.";

      } else if (
        errorMessage.includes("429") ||
        errorMessage
          .toLowerCase()
          .includes("quota")
      ) {
        userMessage =
          "The AI service has temporarily reached its usage limit. Please try again shortly.";

      } else if (
        errorMessage.includes("404")
      ) {
        userMessage =
          "The selected Gemini AI model is not available for this API project.";

      } else if (
        errorMessage.includes("400")
      ) {
        userMessage =
          "The uploaded document could not be processed. Please check that it is a valid PDF or image.";
      }


      return res.status(500).json({

        success: false,

        error: userMessage,

        details:
          process.env.NODE_ENV ===
          "development"
            ? errorMessage
            : undefined,
      });

    } finally {

      /*
      |--------------------------------------------------------------------------
      | Delete temporary upload
      |--------------------------------------------------------------------------
      */

      if (
        uploadedFilePath &&
        fs.existsSync(
          uploadedFilePath
        )
      ) {

        try {

          fs.unlinkSync(
            uploadedFilePath
          );

          console.log(
            "🗑️ Temporary file deleted."
          );

        } catch (cleanupError) {

          console.error(
            "Unable to delete temporary file:",
            cleanupError
          );

        }
      }
    }
  }
);


/*
|--------------------------------------------------------------------------
| Error handler
|--------------------------------------------------------------------------
*/

app.use(
  (
    error,
    req,
    res,
    next
  ) => {

    console.error(
      "Server error:",
      error
    );

    res.status(500).json({

      success: false,

      error:
        error.message ||
        "Server error.",
    });
  }
);


/*
|--------------------------------------------------------------------------
| Start server
|--------------------------------------------------------------------------
*/

app.listen(
  PORT,
  () => {

    console.log("");

    console.log(
      "======================================"
    );

    console.log(
      " MediKiosk AI Server"
    );

    console.log(
      "======================================"
    );

    console.log(
      `🚀 Server: http://localhost:${PORT}`
    );

    console.log(
      `🩺 AI endpoint: http://localhost:${PORT}/api/analyze-document`
    );

    console.log(
      "🔐 Gemini API key loaded: YES"
    );

    console.log("");
  }
);