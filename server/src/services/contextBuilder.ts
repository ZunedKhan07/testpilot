import fs from "fs";
import path from "path";

const ALLOWED_EXTENSIONS = [".ts", ".js", ".json", ".jsx", ".tsx", ".md"];
const IGNORE_DIRS = ["node_modules", ".git", "dist", "build", "coverage", "tmp"];

export const buildRepoContext = (targetPath: string, maxFiles = 15): string => {
  let contextText = "";
  let fileCount = 0;
  const MAX_TOTAL_CHARS = 80000; // Overall context safety limit (~20k tokens)

  const readFilesRecursively = (dir: string) => {
    if (fileCount >= maxFiles || contextText.length >= MAX_TOTAL_CHARS) return;

    const items = fs.readdirSync(dir);

    for (const item of items) {
      if (fileCount >= maxFiles || contextText.length >= MAX_TOTAL_CHARS) break;

      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (!IGNORE_DIRS.includes(item)) {
          readFilesRecursively(fullPath);
        }
      } else {
        const ext = path.extname(item);
        if (ALLOWED_EXTENSIONS.includes(ext) && !item.includes("lock")) {
          try {
            const content = fs.readFileSync(fullPath, "utf-8");
            const relativePath = path.relative(targetPath, fullPath).replace(/\\/g, "/");

            // Poori file append karo (bina slice kiye)
            contextText += `\n--- FILE: ${relativePath} ---\n${content}\n`;
            fileCount++;
          } catch (err) {
            // Skip unreadable files
          }
        }
      }
    }
  };

  if (fs.existsSync(targetPath)) {
    readFilesRecursively(targetPath);
  }

  return contextText;
};