import { GoogleGenAI } from "@google/genai";

export interface IssueItem {
  priority: "HIGH" | "MEDIUM" | "LOW"; // 🔴 HIGH = Important | 🟡 MEDIUM = Recommended | ⚪ LOW = Optional
  category: "BUG" | "SECURITY" | "PERFORMANCE" | "CODE_STYLE";
  title: string;
  description: string;
  file?: string;
  recommendation: string;
}

export interface AIAnalysisResult {
  summary: string;
  architectureNotes: string[];
  issues: IssueItem[];
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
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
You are an expert QA Automation Engineer, Security Auditor & Software Architect.
Analyze the source code context for repository "${repoName}".

Provide a structured JSON output with the following exact keys:
1. "summary": A brief 2-3 sentence overview of what this application does.
2. "architectureNotes": An array of key observations (design patterns, structure, endpoints).
3. "issues": An array of identified potential bugs, security vulnerabilities, or performance bottlenecks. Each object must have:
   - "priority": Exact string "HIGH", "MEDIUM", or "LOW". ("HIGH" = 🔴 Important/Critical bug, "MEDIUM" = 🟡 Recommended/Performance, "LOW" = ⚪ Optional/Code Style)
   - "category": Exact string "BUG", "SECURITY", "PERFORMANCE", or "CODE_STYLE".
   - "title": Short title of the issue.
   - "description": Clear explanation of why this is a problem.
   - "file": File path where the issue was detected (if applicable).
   - "recommendation": Concrete fix or improvement advice.
4. "suggestedPlaywrightTests": An array of objects containing "fileName" and "code" (executable Playwright TypeScript code).

Return ONLY valid JSON without markdown wrapping or extra text.

REPOSITORY CONTEXT:
${contextText}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Updated to current stable model
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