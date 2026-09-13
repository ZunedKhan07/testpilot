import fs from "fs";
import { createTwoFilesPatch } from "diff";
import pc from "picocolors";

export interface AIFixResponse {
  fixType: "CODE_BUG" | "TEST_LOCATOR_BUG";
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
  failureLog: string
): Promise<AIFixResponse | null> => {
  try {
    const response = await fetch(`${serverUrl}/api/ai/fix`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        filePath: changedFilePath,
        fileContent,
        failureLog,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }

    const data = await response.json();

    // Safely map keys in case backend returns legacy fields
    return {
      fixType: data.fixType || data.type || "CODE_BUG",
      explanation: data.explanation || "AI fixed locator or code mismatch.",
      targetFilePath: data.targetFilePath || changedFilePath,
      fixedCode: data.fixedCode || "",
    };
  } catch (error: any) {
    console.error(`AI fix request failed: ${error.message}`);
    return null;
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