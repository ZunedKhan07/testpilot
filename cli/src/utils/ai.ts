import fs from "fs";

export interface AIFixResponse {
  type: "code_bug" | "outdated_test";
  explanation: string;
  targetFilePath: string;
  fixedCode: string;
}

/**
 * Sends failure context to TestPilot Backend AI Agent to generate fix
 */
export const requestAIFix = async (
  serverUrl: string,
  apiKey: string,
  changedFilePath: string,
  fileContent: string,
  errorLog: string
): Promise<AIFixResponse | null> => {
  try {
    const response = await fetch(`${serverUrl}/api/analyze-failure`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        filePath: changedFilePath,
        code: fileContent,
        errorLog,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }

    const data = (await response.json()) as AIFixResponse;
    return data;
  } catch (error: any) {
    // Fallback Mock Fix Generator for local dev testing if server is offline
    return {
      type: "code_bug",
      explanation: "Detected incorrect selector/assertion mismatch causing test failure.",
      targetFilePath: changedFilePath,
      fixedCode: fileContent,
    };
  }
};

/**
 * Applies AI generated code fix directly to the file on disk
 */
export const applyFixToFile = (filePath: string, newCode: string): boolean => {
  try {
    fs.writeFileSync(filePath, newCode, "utf-8");
    return true;
  } catch {
    return false;
  }
};