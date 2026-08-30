import { Router } from "express";
import { createProjectAnalysis } from "../controllers/project.controller.js";

const router = Router();
router.post("/analyze-repo", createProjectAnalysis);

export default router;