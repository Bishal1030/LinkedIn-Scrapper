import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const extractJSON = (text: string) => {
  // remove markdown fences if any
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  // extract only JSON object
  const match = cleaned.match(/\{[\s\S]*\}/);

  if (!match) {
    throw new Error("Invalid JSON from AI");
  }

  return JSON.parse(match[0]);
};

export const extractProfileWithAI = async (text: string) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
You are a strict LinkedIn data extraction system.

Return ONLY valid JSON. No markdown. No explanations.

Schema:
{
  "name": string | null,
  "headline": string | null,
  "location": string | null,
  "company": string | null,
  "about": string | null,
  "experience": string[],
  "education": string[],
  "skills": string[]
}

Rules:
- Output MUST be valid JSON
- No backticks
- No commentary
- Use null if missing

TEXT:
${text}
`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  return extractJSON(response);
};