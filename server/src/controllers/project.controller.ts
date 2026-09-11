import type { Request, Response } from "express";
import { Project } from "../models/Project.model.js";
import { isValidGeminiKey, encryptKey } from "../utils/security.js";
import { analyzeRepository } from "../services/analyzer.js";

export const createProjectAnalysis = async (req: Request, res: Response) => {
  try {
    const { geminiApiKey, repoUrl } = req.body;

    console.log("Received Key:", geminiApiKey);
    console.log("Is Key Valid?:", isValidGeminiKey(geminiApiKey));

    // 1. Validate API Key
    if (!isValidGeminiKey(geminiApiKey)) {
      return res.status(400).json({ success: false, error: "Invalid Gemini API Key format" });
    }

    if (!repoUrl) {
      return res.status(400).json({ success: false, error: "Repository URL is required" });
    }

    // 2. Encrypt Key for DB storage
    const encryptedApiKey = encryptKey(geminiApiKey);

    // 3. Scan & Analyze GitHub Repo
    const techMap = await analyzeRepository(repoUrl);

    // 4. Save to Database
    const project = await Project.create({
      geminiApiKey: encryptedApiKey,
      repoUrl,
      techMap,
    });

    return res.status(201).json({
      success: true,
      data: {
        projectId: project._id,
        repoUrl: project.repoUrl,
        techMap: project.techMap,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};