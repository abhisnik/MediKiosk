export const redFlagRules = [
  { pattern: /severe chest pain|crushing chest pain/i, message: "Severe chest pain reported." },
  { pattern: /difficulty breathing|can't breathe|cannot breathe|breathlessness/i, message: "Breathing difficulty reported." },
  { pattern: /unconscious|passed out|loss of consciousness/i, message: "Loss of consciousness reported." },
  { pattern: /severe bleeding|heavy bleeding/i, message: "Severe bleeding reported." },
  { pattern: /stroke|face drooping|slurred speech|weakness on one side/i, message: "Possible acute neurological warning sign reported." }
];

export function detectRedFlags(text = "") {
  return redFlagRules
    .filter(rule => rule.pattern.test(text))
    .map(rule => rule.message);
}