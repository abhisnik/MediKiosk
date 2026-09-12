const rules = [
  { pattern: /severe chest pain|crushing chest pain/i, code: "CHEST_PAIN" },
  { pattern: /difficulty breathing|can't breathe|cannot breathe/i, code: "BREATHING_DIFFICULTY" },
  { pattern: /unconscious|passed out/i, code: "LOSS_OF_CONSCIOUSNESS" }
];

exports.detectRedFlags = text =>
  rules.filter(rule => rule.pattern.test(text || "")).map(rule => rule.code);