import { simpleGit, SimpleGit, StatusResult } from "simple-git";
import path from "path";
import fs from "fs";

const git: SimpleGit = simpleGit();

export interface ChangedFile {
  filePath: string;
  absolutePath: string;
  status: "modified" | "created" | "deleted" | "renamed";
  content?: string;
}

/**
 * Checks if the current workspace is a valid Git repository
 */
export const isGitRepo = async (): Promise<boolean> => {
  try {
    return await git.checkIsRepo();
  } catch {
    return false;
  }
};

/**
 * Scans workspace and returns list of changed/uncommitted files
 */
export const getChangedFiles = async (): Promise<ChangedFile[]> => {
  if (!(await isGitRepo())) {
    throw new Error("Current directory is not a Git repository.");
  }

  const status: StatusResult = await git.status();
  const changedFiles: ChangedFile[] = [];

  // Combine modified, created, and staged files
  const allModified = [
    ...status.created,
    ...status.modified,
    ...status.staged,
    ...status.not_added,
  ];

  // Filter unique paths (avoid duplicates if file is staged & modified)
  const uniquePaths = Array.from(new Set(allModified));

  for (const relativePath of uniquePaths) {
    const absolutePath = path.join(process.cwd(), relativePath);

    // Skip node_modules, lock files, dist, and testpilot config
    if (
      relativePath.includes("node_modules") ||
      relativePath.includes("dist") ||
      relativePath.endsWith(".lock") ||
      relativePath === "testpilot.config.json"
    ) {
      continue;
    }

    if (fs.existsSync(absolutePath)) {
      const content = fs.readFileSync(absolutePath, "utf-8");
      changedFiles.push({
        filePath: relativePath,
        absolutePath,
        status: status.created.includes(relativePath) ? "created" : "modified",
        content,
      });
    }
  }

  return changedFiles;
};