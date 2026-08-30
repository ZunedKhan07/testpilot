import { simpleGit } from "simple-git";
import fs from "fs";
import path from "path";

export interface TechMap {
  repoName: string;
  language: string;
  frameworks: string[];
  hasTests: boolean;
  testRunner: string | null;
  fileTree: string[];
}

export const analyzeRepository = async (repoUrl: string): Promise<TechMap> => {
  const repoName = repoUrl.split("/").pop()?.replace(".git", "") || "temp-repo";
  const targetPath = path.join(process.cwd(), "tmp", repoName);

  // Clear existing tmp folder for clean scan
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
  }

  // Fast shallow clone
  const git = simpleGit();
  await git.clone(repoUrl, targetPath, ["--depth", "1"]);

  // Recursive directory scanner (ignoring heavy folders)
  const ignoreList = ["node_modules", ".git", "dist", "build", ".next", "coverage"];
  const fileTree: string[] = [];

  const scanDir = (dir: string, relativePath = "") => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (ignoreList.includes(file)) continue;
      const fullPath = path.join(dir, file);
      const relPath = path.join(relativePath, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDir(fullPath, relPath);
      } else {
        fileTree.push(relPath.replace(/\\/g, "/"));
      }
    }
  };

  scanDir(targetPath);

  // Tech stack detection via package.json
  let language = "JavaScript";
  const frameworks: string[] = [];
  let hasTests = false;
  let testRunner: string | null = null;

  const pkgPath = path.join(targetPath, "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkgData = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    const allDeps = { ...pkgData.dependencies, ...pkgData.devDependencies };

    if (allDeps["typescript"] || fileTree.some((f) => f.endsWith(".ts") || f.endsWith(".tsx"))) {
      language = "TypeScript";
    }

    if (allDeps["react"]) frameworks.push("React");
    if (allDeps["next"]) frameworks.push("Next.js");
    if (allDeps["express"]) frameworks.push("Express");
    if (allDeps["tailwindcss"]) frameworks.push("Tailwind CSS");

    if (allDeps["@playwright/test"] || allDeps["playwright"]) {
      hasTests = true;
      testRunner = "Playwright";
    } else if (allDeps["jest"]) {
      hasTests = true;
      testRunner = "Jest";
    }
  }

  // Cleanup temporary cloned folder after analysis
  fs.rmSync(targetPath, { recursive: true, force: true });

  return {
    repoName,
    language,
    frameworks,
    hasTests,
    testRunner,
    fileTree: fileTree.slice(0, 50), // Top 50 important files limit
  };
};