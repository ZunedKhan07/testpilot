import fs from "fs";
import path from "path";

export interface ScanLogEntry {
  id: string;
  timestamp: string;
  filePath: string;
  status: "PASSED" | "FAILED" | "FIXED" | "ROLLED_BACK";
  explanation?: string;
  diff?: string;
}

const LOG_FILE = path.join(process.cwd(), ".testpilot-history.json");

/**
 * Saves scan results to a local JSON file for the Web Dashboard
 */
export const saveScanLog = (entry: ScanLogEntry) => {
  try {
    let history: ScanLogEntry[] = [];
    if (fs.existsSync(LOG_FILE)) {
      const content = fs.readFileSync(LOG_FILE, "utf-8");
      history = JSON.parse(content);
    }
    history.unshift(entry); // Recent logs first
    fs.writeFileSync(LOG_FILE, JSON.stringify(history, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to save scan history log:", error);
  }
};