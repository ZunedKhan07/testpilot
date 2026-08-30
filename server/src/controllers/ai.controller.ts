import type { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { simpleGit } from "simple-git";
import { Project } from "../models/Project.model.js";
import { decryptKey } from "../utils/security.js";
import { buildRepoContext } from "../services/contextBuilder.js";
import { generateRepoAnalysisAndTests } from "../services/geminiService.js";

export const generateTestsAndAnalysis = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({ success: false, error: "projectId is required" });
    }

    // 1. Fetch Project from DB
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, error: "Project not found" });
    }

    // 2. Decrypt API Key
    const plainApiKey = decryptKey(project.geminiApiKey);

    // 3. Re-clone Repo Temporarily for Context Reading
    const repoName = project.repoUrl.split("/").pop()?.replace(".git", "") || "temp-repo";
    const targetPath = path.join(process.cwd(), "tmp", repoName);

    if (fs.existsSync(targetPath)) {
      fs.rmSync(targetPath, { recursive: true, force: true });
    }

    const git = simpleGit();
    await git.clone(project.repoUrl, targetPath, ["--depth", "1"]);

    // 4. Build Code Context
    const contextText = buildRepoContext(targetPath);

    // Cleanup cloned files after reading context
    fs.rmSync(targetPath, { recursive: true, force: true });

    if (!contextText) {
      return res.status(400).json({ success: false, error: "Could not extract code context from repository" });
    }

    // 5. Call Gemini AI Service
    const aiResult = await generateRepoAnalysisAndTests(plainApiKey, repoName, contextText);

    return res.status(200).json({
      success: true,
      projectId: project._id,
      repoUrl: project.repoUrl,
      result: aiResult,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};