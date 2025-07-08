// utils/gemini.ts
export async function getGeminiScores(resumeText: string) {
  const prompt = `
    Analyze the following resume text and rate the candidate from 1 to 5 on:
    - Work Ethic
    - Creativity
    - Skills
    Return as JSON: { "workEthic": number, "creativity": number, "skills": number }
    Resume: ${resumeText}
  `;
  const response = await fetch("https://generativeai.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  const data = await response.json();
  // Parse Gemini's response to extract the JSON
  const scores = JSON.parse(data.candidates[0].content.parts[0].text);
  return scores;
}
