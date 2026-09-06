import * as p from "@clack/prompts";
import pc from "picocolors";
import { loadConfig } from "../utils/config.js";
import { getChangedFiles, isGitRepo } from "../utils/git.js";
import {
  findAssociatedTestFile,
  runPlaywrightTest,
} from "../utils/playwright.js";

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
      pc.yellow(
        `Detected ${changedFiles.length} modified file(s). Checking for associated tests...`
      )
    );

    for (const file of changedFiles) {
      p.log.info(` • ${pc.cyan(file.filePath)} [${pc.dim(file.status.toUpperCase())}]`);

      // Check if Playwright test file exists for this changed file
      const testFile = findAssociatedTestFile(file.filePath);

      if (testFile) {
        const testSpinner = p.spinner();
        testSpinner.start(`Executing Playwright E2E test for ${file.filePath}...`);

        const result = await runPlaywrightTest(testFile);

        if (result.passed) {
          testSpinner.stop(pc.green(`✔ Test passed for ${file.filePath}`));
        } else {
          testSpinner.stop(pc.red(`✖ Test failed for ${file.filePath}`));
          p.log.error(pc.bold("Captured Failure Log (Ready for AI Auto-Fix):"));
          p.log.message(pc.dim(result.errorLog?.slice(0, 300) + "..."));
        }
      } else {
        p.log.warn(
          `No matching Playwright test found for ${pc.gray(file.filePath)}. Skipping test run.`
        );
      }
    }

    p.note(
      `Focused scan active: Only these ${changedFiles.length} file(s) and test traces will be processed.`,
      "Targeted Analysis"
    );

    p.outro(pc.green("Git Change Detection & Test Run Completed! ⚡"));
  } catch (error: any) {
    spinner.stop("Failed to scan Git repository or run tests.");
    p.log.error(error.message || "Unknown error occurred.");
    process.exit(1);
  }
};