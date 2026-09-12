export async function getNextQuestion({ questions, index }) {
  return questions[index] || null;
}

export async function saveConversationAnswer(answer) {
  return answer;
}