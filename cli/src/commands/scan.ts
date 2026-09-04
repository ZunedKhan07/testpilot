import * as p from "@clack/prompts";
import pc from "picocolors";
import { loadConfig } from "../utils/config.js";
import { getChangedFiles, isGitRepo } from "../utils/git.js";

export const handleScan = async () => {
  p.intro(pc.bgMagenta(pc.black(" TestPilot Change Detector ")));

  const config = loadConfig();
  if (!config) {
    p.log.error(
      `Configuration missing. Please run ${pc.cyan("npx testpilot init")} first.`
    );
    process.exit(1);
  }

  if (!(await isGitRepo())) {
    p.log.warn("Not a Git repository. Skipping change detection.");
    process.exit(0);
  }

  const spinner = p.spinner();
  spinner.start("Scanning local Git workspace for modified files...");

  try {
    const changedFiles = await getChangedFiles();

    if (changedFiles.length === 0) {
      spinner.stop(pc.green("No changed files detected. Codebase is clean!"));
      p.outro(pc.gray("Server starting normally... 🚀"));
      process.exit(0);
    }

    spinner.stop(
      pc.yellow(`Detected ${changedFiles.length} modified file(s):`)
    );

    // List changed files on terminal
    changedFiles.forEach((file) => {
      p.log.info(
        ` • ${pc.cyan(file.filePath)} [${pc.dim(file.status.toUpperCase())}]`
      );
    });

    p.note(
      `Focused scan active: Only these ${changedFiles.length} file(s) will be sent to AI for validation, saving ~90% API tokens.`,
      "Targeted Analysis"
    );

    p.outro(pc.green("Git Change Detection Completed! ⚡"));
  } catch (error: any) {
    spinner.stop("Failed to scan Git repository.");
    p.log.error(error.message || "Unknown error occurred.");
    process.exit(1);
  }
};