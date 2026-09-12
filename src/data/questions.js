export const questions = [
  {
    id: "chiefComplaint",
    type: "text",

    en: "What is the main problem or symptom bringing you to the clinic?",
    hi: "आपको क्लिनिक आने की मुख्य समस्या या लक्षण क्या है?",
    bn: "কোন প্রধান সমস্যা বা উপসর্গের জন্য আপনি ক্লিনিকে এসেছেন?"
  },

  {
    id: "duration",
    type: "text",

    en: "How long have you had this problem?",
    hi: "आपको यह समस्या कितने समय से है?",
    bn: "আপনার এই সমস্যা কতদিন ধরে রয়েছে?"
  },

  {
    id: "severity",
    type: "choice",

    en: "How severe is it right now?",
    hi: "अभी यह समस्या कितनी गंभीर है?",
    bn: "এই মুহূর্তে সমস্যাটি কতটা গুরুতর?",

    options: {
      en: ["Mild", "Moderate", "Severe"],
      hi: ["हल्का", "मध्यम", "गंभीर"],
      bn: ["হালকা", "মাঝারি", "গুরুতর"]
    }
  },

  {
    id: "associated",
    type: "text",

    en: "Do you have any other symptoms along with it?",
    hi: "क्या इसके साथ आपको कोई अन्य लक्षण भी हैं?",
    bn: "এর সঙ্গে আপনার কি অন্য কোনো উপসর্গও রয়েছে?"
  },

  {
    id: "medications",
    type: "text",

    en: "Are you currently taking any medicines?",
    hi: "क्या आप वर्तमान में कोई दवा ले रहे हैं?",
    bn: "আপনি কি বর্তমানে কোনো ওষুধ গ্রহণ করছেন?"
  },

  {
    id: "allergies",
    type: "text",

    en: "Do you have any known medicine or food allergies?",
    hi: "क्या आपको किसी दवा या भोजन से एलर्जी है?",
    bn: "আপনার কি কোনো ওষুধ বা খাবারে অ্যালার্জি আছে?"
  },

  {
    id: "history",
    type: "text",

    en: "Do you have any important past medical conditions or surgeries?",
    hi: "क्या आपको पहले कोई महत्वपूर्ण बीमारी हुई है या कोई सर्जरी हुई है?",
    bn: "আপনার কি আগে কোনো গুরুত্বপূর্ণ রোগ বা অস্ত্রোপচার হয়েছে?"
  }
];