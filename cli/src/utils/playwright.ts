import { exec } from "child_process";
import util from "util";
import fs from "fs";
import path from "path";

const execPromise = util.promisify(exec);

export interface TestResult {
  hasTests: boolean;
  passed: boolean;
  testFile?: string;
  errorLog?: string;
}

/**
 * Checks if a corresponding test file exists for a given changed file
 */
export const findAssociatedTestFile = (changedFilePath: string): string | null => {
  const fileName = path.basename(changedFilePath, path.extname(changedFilePath));
  
  // Potential test locations: tests/login.spec.ts or src/login.test.ts etc.
  const possiblePaths = [
    path.join(process.cwd(), "tests", `${fileName}.spec.ts`),
    path.join(process.cwd(), "tests", `${fileName}.test.ts`),
    path.join(process.cwd(), "src", `${fileName}.spec.ts`),
    path.join(process.cwd(), "src", `${fileName}.test.ts`),
  ];

  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      return testPath;
    }
  }

  return null;
};

/**
 * Runs Playwright E2E test for a specific test file
 */
export const runPlaywrightTest = async (testFilePath: string): Promise<TestResult> => {
  try {
    // Run Playwright test in headless mode for fast speed
    await execPromise(`npx playwright test "${testFilePath}" --reporter=json`);
    return {
      hasTests: true,
      passed: true,
      testFile: testFilePath,
    };
  } catch (error: any) {
    // Capture failure output trace
    return {
      hasTests: true,
      passed: false,
      testFile: testFilePath,
      errorLog: error.stdout || error.stderr || error.message,
    };
  }
};