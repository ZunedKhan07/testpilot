import "dotenv/config";
import * as p from "@clack/prompts";
import pc from "picocolors";
import { loadConfig } from "../utils/config.js";
import {
  getChangedFiles,
  isGitRepo,
  createFixBranchAndCommit,
} from "../utils/git.js";
import {
  findAssociatedTestFile,
  runPlaywrightTest,
} from "../utils/playwright.js";
import {
  requestAIFix,
  showDiffPreview,
  applySafeFix,
  rollbackFix,
} from "../utils/ai.js";
import { saveScanLog } from "../utils/logger.js"; // Logger Import

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
      spinner.stop(pc.green("No changed files detected. Workspace clean!"));
      p.outro(pc.gray("Server starting normally... 🚀"));
      process.exit(0);
    }

    spinner.stop(
      pc.yellow(`Detected ${changedFiles.length} modified file(s). Running QA Verification...`)
    );

    for (const file of changedFiles) {
      p.log.info(` • ${pc.cyan(file.filePath)} [${pc.dim(file.status.toUpperCase())}]`);

      const testFile = findAssociatedTestFile(file.filePath);

      if (testFile) {
        const testSpinner = p.spinner();
        testSpinner.start(`Executing Playwright test for ${file.filePath}...`);

        const result = await runPlaywrightTest(testFile);

        if (result.passed) {
          testSpinner.stop(pc.green(`✔ Test passed for ${file.filePath}`));
          
          // Log Passed Status
          saveScanLog({
            id: `scan-${Date.now()}`,
            timestamp: new Date().toISOString(),
            filePath: file.filePath,
            status: "PASSED",
          });

        } else {
          testSpinner.stop(pc.red(`✖ Test failed for ${file.filePath}`));

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

          if (aiFix && aiFix.fixedCode) {
            const fixTypeDisplay = (aiFix.fixType || "CODE_BUG").toString().toUpperCase();

            p.note(
              `${pc.bold("Diagnosis:")} ${aiFix.explanation}\n${pc.bold("Fix Type:")} ${fixTypeDisplay}`,
              "AI Proposed Solution"
            );

            showDiffPreview(file.filePath, file.content || "", aiFix.fixedCode);

            const shouldFix = await p.confirm({
              message: `Apply proposed AI Auto-Fix to ${pc.cyan(file.filePath)}?`,
              initialValue: true,
            });

            if (p.isCancel(shouldFix) || !shouldFix) {
              p.log.warn("Auto-fix skipped by user.");
              
              saveScanLog({
                id: `scan-${Date.now()}`,
                timestamp: new Date().toISOString(),
                filePath: file.filePath,
                status: "FAILED",
                explanation: aiFix.explanation,
              });

            } else {
              const { backupCode, success } = applySafeFix(file.absolutePath, aiFix.fixedCode);

              if (success) {
                p.log.success(pc.green(`✔ Fix applied. Re-running Playwright verification test...`));

                const verifySpinner = p.spinner();
                verifySpinner.start("Verifying fix stability...");
                const verifyResult = await runPlaywrightTest(testFile);

                if (verifyResult.passed) {
                  verifySpinner.stop(pc.green(`🎉 Auto-Fix Verified & Passed!`));

                  // Log Fixed Status
                  saveScanLog({
                    id: `scan-${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    filePath: file.filePath,
                    status: "FIXED",
                    explanation: aiFix.explanation,
                    diff: aiFix.fixedCode,
                  });

                  const createPR = await p.confirm({
                    message: `Create a Git fix-branch for ${pc.cyan(file.filePath)}?`,
                    initialValue: true,
                  });

                  if (createPR && !p.isCancel(createPR)) {
                    const gitSpinner = p.spinner();
                    gitSpinner.start("Creating Git branch & committing verified fix...");
                    const { branchName, success: gitSuccess } = await createFixBranchAndCommit(file.filePath);
                    
                    if (gitSuccess) {
                      gitSpinner.stop(pc.green(`✔ Fix committed on branch: ${pc.cyan(branchName)}`));
                    } else {
                      gitSpinner.stop(pc.red("Failed to create Git branch."));
                    }
                  }
                } else {
                  verifySpinner.stop(pc.red(`⚠️ Re-test failed after applying fix. Rolling back changes...`));
                  rollbackFix(file.absolutePath, backupCode);
                  p.log.error(pc.yellow(`🔄 Rollback completed! Restored ${file.filePath}.`));

                  // Log Rolled back Status
                  saveScanLog({
                    id: `scan-${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    filePath: file.filePath,
                    status: "ROLLED_BACK",
                    explanation: "Verification failed post-fix. Auto-rollback triggered.",
                  });
                }
              }
            }
          }
        }
      } else {
        p.log.warn(`No Playwright test found for ${pc.gray(file.filePath)}.`);
      }
    }

    p.outro(pc.green("TestPilot Execution Completed! ⚡"));
  } catch (error: any) {
    spinner.stop("Failed execution scan.");
    p.log.error(error.message || "Unknown error occurred.");
    process.exit(1);
  }
};