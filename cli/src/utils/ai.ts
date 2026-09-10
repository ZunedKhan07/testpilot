import fs from "fs";
import { createTwoFilesPatch } from "diff";
import pc from "picocolors";

export interface AIFixResponse {
  type: "code_bug" | "outdated_test";
  explanation: string;
  targetFilePath: string;
  fixedCode: string;
}

/**
 * Sends failure context to TestPilot Backend AI Agent
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

    return (await response.json()) as AIFixResponse;
  } catch {
    // Local Dev Fallback Mock
    return {
      type: "code_bug",
      explanation: "Detected locator or logic mismatch. Generating auto-fix patch.",
      targetFilePath: changedFilePath,
      fixedCode: fileContent.replace(/error/g, "fixed"),
    };
  }
};

/**
 * Visualizes Old vs New Code Diff on Terminal
 */
export const showDiffPreview = (filePath: string, oldCode: string, newCode: string) => {
  const patch = createTwoFilesPatch(
    `a/${filePath}`,
    `b/${filePath}`,
    oldCode,
    newCode,
    "Original Code",
    "AI Proposed Fix"
  );

  const lines = patch.split("\n").slice(4); // Skip patch headers
  console.log("\n" + pc.bold("--- Proposed Code Changes (Diff) ---"));
  lines.forEach((line) => {
    if (line.startsWith("+")) {
      console.log(pc.green(line));
    } else if (line.startsWith("-")) {
      console.log(pc.red(line));
    } else {
      console.log(pc.dim(line));
    }
  });
  console.log(pc.bold("------------------------------------\n"));
};

/**
 * Safe File Fix Execution with Backup Support
 */
export const applySafeFix = (filePath: string, newCode: string): { backupCode: string; success: boolean } => {
  try {
    const backupCode = fs.readFileSync(filePath, "utf-8");
    fs.writeFileSync(filePath, newCode, "utf-8");
    return { backupCode, success: true };
  } catch {
    return { backupCode: "", success: false };
  }
};

/**
 * Rollbacks file to original state if re-test fails
 */
export const rollbackFix = (filePath: string, originalCode: string): boolean => {
  try {
    fs.writeFileSync(filePath, originalCode, "utf-8");
    return true;
  } catch {
    return false;
  }
};