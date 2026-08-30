import { GoogleGenAI } from "@google/genai";

interface AIAnalysisResult {
  summary: string;
  architectureNotes: string[];
  suggestedPlaywrightTests: {
    fileName: string;
    code: string;
  }[];
}

export const generateRepoAnalysisAndTests = async (
  apiKey: string,
  repoName: string,
  contextText: string
): Promise<AIAnalysisResult> => {
  // Initialize Gemini SDK with User's own API Key
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
You are an expert QA Automation Engineer & Software Architect.
Analyze the following source code context for repository "${repoName}".

Provide a structured JSON output with the following exact keys:
1. "summary": A brief 2-3 sentence overview of what this application does.
2. "architectureNotes": An array of key observations (design patterns, structure, endpoints).
3. "suggestedPlaywrightTests": An array of objects, each containing:
   - "fileName": Appropriate filename for Playwright test (e.g., "auth.spec.ts").
   - "code": Clean, executable Playwright TypeScript code based on the routes/logic found.

Return ONLY valid JSON without markdown wrapping or extra text.

REPOSITORY CONTEXT:
${contextText}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "{}";
    return JSON.parse(responseText) as AIAnalysisResult;
  } catch (error: any) {
    throw new Error(`Gemini AI Processing Failed: ${error.message}`);
  }
};