export async function getGeminiScores(resumeText: string) {
  console.log("GEMINI CALL");

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const prompt = `
Analyze the following resume text brutally yet honestly, accurately and rate the candidate from 1 to 5 on:
- Work Ethic
- Creativity
- Skills

Only return raw JSON without any explanation or formatting:
{ "workEthic": number, "creativity": number, "skills": number }

Resume: ${resumeText}
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );

  console.log(response);

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error("Gemini API response malformed or empty.");
  }

  // Strip Markdown code block if present
  const cleanedText = rawText.replace(/```(?:json)?\s*([\s\S]*?)\s*```/, "$1").trim();

  try {
    const scores = JSON.parse(cleanedText);
    return scores;
  } catch (err) {
    console.error("Failed to parse Gemini response JSON:", cleanedText);
    throw err;
  }
}
