import "dotenv/config";
import * as p from "@clack/prompts";
import pc from "picocolors";
import { loadConfig } from "../utils/config.js";
import { getChangedFiles, isGitRepo } from "../utils/git.js";
import {
  findAssociatedTestFile,
  runPlaywrightTest,
} from "../utils/playwright.js";
import { requestAIFix, applyFixToFile } from "../utils/ai.js";

export const handleScan = async () => {
  p.intro(pc.bgMagenta(pc.black(" TestPilot QA Automation Engine ")));

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

      const testFile = findAssociatedTestFile(file.filePath);

      if (testFile) {
        const testSpinner = p.spinner();
        testSpinner.start(`Executing Playwright E2E test for ${file.filePath}...`);

        const result = await runPlaywrightTest(testFile);

        if (result.passed) {
          testSpinner.stop(pc.green(`✔ Test passed for ${file.filePath}`));
        } else {
          testSpinner.stop(pc.red(`✖ Test failed for ${file.filePath}`));

          p.log.error(pc.bold("Captured Failure Log:"));
          p.log.message(pc.dim(result.errorLog?.slice(0, 200) + "..."));

          // Trigger AI QA Agent
          const aiSpinner = p.spinner();
          aiSpinner.start("🤖 AI QA Agent analyzing failure trace & code...");

          const aiFix = await requestAIFix(
            config.serverUrl,
            config.geminiApiKey || "",
            file.filePath,
            file.content || "",
            result.errorLog || ""
          );

          aiSpinner.stop(pc.cyan("🤖 AI QA Agent Analysis Complete!"));

          if (aiFix) {
            p.note(
              `${pc.bold("Diagnosis:")} ${aiFix.explanation}\n${pc.bold(
                "Fix Type:"
              )} ${aiFix.type.toUpperCase()}`,
              "AI QA Recommendation"
            );

            const shouldFix = await p.confirm({
              message: `Apply AI Auto-Fix directly to ${pc.cyan(file.filePath)}?`,
              initialValue: true,
            });

            if (p.isCancel(shouldFix) || !shouldFix) {
              p.log.warn("Auto-fix skipped by user.");
            } else {
              const success = applyFixToFile(file.absolutePath, aiFix.fixedCode);
              if (success) {
                p.log.success(
                  pc.green(`✔ File ${file.filePath} updated successfully!`)
                );
              } else {
                p.log.error(`Failed to write fix to ${file.filePath}`);
              }
            }
          }
        }
      } else {
        p.log.warn(
          `No matching Playwright test found for ${pc.gray(file.filePath)}. Skipping test run.`
        );
      }
    }

    p.outro(pc.green("TestPilot QA Engine Run Completed! ⚡"));
  } catch (error: any) {
    spinner.stop("Failed to scan Git repository or run tests.");
    p.log.error(error.message || "Unknown error occurred.");
    process.exit(1);
  }
};