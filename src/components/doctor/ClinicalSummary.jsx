// export default function ClinicalSummary({
//   summary
// }) {
//   const fields = [
//     [
//       "Chief complaint",
//       summary?.chiefComplaint
//     ],
//     [
//       "Duration",
//       summary?.duration
//     ],
//     [
//       "Severity",
//       summary?.severity
//     ],
//     [
//       "Associated symptoms",
//       summary?.associatedSymptoms
//     ],
//     [
//       "Current medications",
//       summary?.currentMedications
//     ],
//     [
//       "Allergies",
//       summary?.allergies
//     ],
//     [
//       "Past history",
//       summary?.pastHistory
//     ]
//   ];

//   const documents =
//     summary?.documentInsights || [];


//   return (
//     <div className="card">

//       <h2 className="section-title">
//         Clinical Summary
//       </h2>


//       {/* Patient interview information */}
//       {fields.map(
//         ([label, value]) => (
//           <div
//             key={label}
//             style={{
//               marginTop: 14
//             }}
//           >
//             <strong>
//               {label}
//             </strong>

//             <div className="muted">
//               {value || "Not provided"}
//             </div>
//           </div>
//         )
//       )}


//       {/* AI medical document information */}
//       {documents.length > 0 && (
//         <div
//           style={{
//             marginTop: 30,
//             paddingTop: 20,
//             borderTop:
//               "1px solid #e2e8f0"
//           }}
//         >
//           <h3 className="section-title">
//             AI-extracted medical records
//           </h3>


//           {documents.map(
//             (document, documentIndex) => (
//               <div
//                 key={documentIndex}
//                 style={{
//                   marginTop: 18
//                 }}
//               >

//                 <strong>
//                   {document.documentType ||
//                     "Medical document"}
//                 </strong>


//                 {/* Main sections */}
//                 {document.mainSections?.map(
//                   (section, index) => (
//                     <div
//                       key={index}
//                       style={{
//                         marginTop: 12,
//                         padding: 12,
//                         border:
//                           "1px solid #e2e8f0",
//                         borderRadius: 10
//                       }}
//                     >
//                       <strong>
//                         {section.section}
//                       </strong>

//                       <div className="muted">
//                         {section.content}
//                       </div>
//                     </div>
//                   )
//                 )}


//                 {/* Key findings */}
//                 {document.keyFindings
//                   ?.length > 0 && (
//                   <div
//                     style={{
//                       marginTop: 16
//                     }}
//                   >
//                     <strong>
//                       Key findings
//                     </strong>

//                     <ul>
//                       {document.keyFindings.map(
//                         (finding, index) => (
//                           <li key={index}>
//                             {finding}
//                           </li>
//                         )
//                       )}
//                     </ul>
//                   </div>
//                 )}


//                 {/* Diagnoses */}
//                 {document.diagnoses
//                   ?.length > 0 && (
//                   <div
//                     style={{
//                       marginTop: 16
//                     }}
//                   >
//                     <strong>
//                       Diagnoses / impressions
//                     </strong>

//                     <ul>
//                       {document.diagnoses.map(
//                         (item, index) => (
//                           <li key={index}>
//                             {typeof item ===
//                             "string"
//                               ? item
//                               : JSON.stringify(item)}
//                           </li>
//                         )
//                       )}
//                     </ul>
//                   </div>
//                 )}


//                 {/* Doctor summary */}
//                 {document.doctorSummary && (
//                   <div
//                     style={{
//                       marginTop: 16,
//                       padding: 14,
//                       background:
//                         "#f7fbff",
//                       borderRadius: 10
//                     }}
//                   >
//                     <strong>
//                       Document summary
//                     </strong>

//                     <p className="muted">
//                       {
//                         document.doctorSummary
//                       }
//                     </p>
//                   </div>
//                 )}

//               </div>
//             )
//           )}
//         </div>
//       )}

//     </div>
//   )
// }
import { useNavigate } from "react-router-dom";

export default function ClinicalSummary({ 
  summary, 
  language = "en" 
}) { 
  const navigate = useNavigate();

  const text = { 
    en: { 
      title: "Clinical Summary", 
      back: "← Back",
      chiefComplaint: "Chief complaint", 
      duration: "Duration", 
      severity: "Severity", 
      associatedSymptoms: "Associated symptoms", 
      currentMedications: "Current medications", 
      allergies: "Allergies", 
      pastHistory: "Past medical history", 
      documentsReviewed: "Documents reviewed" 
    }, 
 
    hi: { 
      title: "क्लिनिकल सारांश", 
      back: "← वापस",
      chiefComplaint: "मुख्य समस्या / शिकायत", 
      duration: "समस्या की अवधि", 
      severity: "गंभीरता", 
      associatedSymptoms: "संबंधित लक्षण", 
      currentMedications: "वर्तमान दवाइयाँ", 
      allergies: "एलर्जी", 
      pastHistory: "पिछला मेडिकल इतिहास", 
      documentsReviewed: "समीक्षा किए गए दस्तावेज़" 
    }, 
 
    bn: { 
      title: "ক্লিনিক্যাল সারাংশ", 
      back: "← ফিরে যান",
      chiefComplaint: "প্রধান সমস্যা / অভিযোগ", 
      duration: "সমস্যার সময়কাল", 
      severity: "তীব্রতা", 
      associatedSymptoms: "সম্পর্কিত উপসর্গ", 
      currentMedications: "বর্তমান ওষুধ", 
      allergies: "অ্যালার্জি", 
      pastHistory: "পূর্ববর্তী চিকিৎসার ইতিহাস", 
      documentsReviewed: "পর্যালোচনা করা নথি" 
    } 
  }; 
 
  const labels = 
    text[language] || text.en; 
 
  const fields = [ 
    { 
      label: labels.chiefComplaint, 
      value: summary?.chiefComplaint 
    }, 
    { 
      label: labels.duration, 
      value: summary?.duration 
    }, 
    { 
      label: labels.severity, 
      value: summary?.severity 
    }, 
    { 
      label: labels.associatedSymptoms, 
      value: summary?.associatedSymptoms 
    }, 
    { 
      label: labels.currentMedications, 
      value: summary?.currentMedications 
    }, 
    { 
      label: labels.allergies, 
      value: summary?.allergies 
    }, 
    { 
      label: labels.pastHistory, 
      value: summary?.pastHistory 
    }, 
    { 
      label: labels.documentsReviewed, 
      value: summary?.documentsReviewed ?? 0 
    } 
  ]; 
 
  return ( 
    <div className="card">

      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        style={{
          marginBottom: 20,
          padding: "9px 18px",
          border: "none",
          borderRadius: 8,
          background: "#1976b5",
          color: "white",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer"
        }}
      >
        {labels.back}
      </button>
 
      <h2 className="section-title"> 
        {labels.title} 
      </h2> 
 
      {fields.map((field) => ( 
        <div 
          key={field.label} 
          style={{ 
            marginTop: 14 
          }} 
        > 
 
          <strong> 
            {field.label} 
          </strong> 
 
          <div className="muted"> 
            {field.value || "—"} 
          </div> 
 
        </div> 
      ))} 
 
    </div> 
  ); 
}