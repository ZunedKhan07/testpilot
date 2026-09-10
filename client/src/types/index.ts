export type ActiveTab = "hero" | "docs" | "audit" | "logs" | "contact";

export interface IssueItem {
  priority: "CRITICAL" | "RECOMMENDED" | "OPTIONAL";
  title: string;
  description: string;
  suggestedFix?: string;
}

export interface AnalysisResult {
  summary?: string;
  issues?: IssueItem[];
  generatedTests?: string[];
  [key: string]: any;
}

export interface ScanLogEntry {
  id: string;
  timestamp: string;
  filePath: string;
  status: "PASSED" | "FAILED" | "FIXED" | "ROLLED_BACK";
  explanation?: string;
}