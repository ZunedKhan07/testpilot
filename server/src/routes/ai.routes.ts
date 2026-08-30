import { Router } from "express";
import { generateTestsAndAnalysis } from "../controllers/ai.controller.js";

const router = Router();

router.post("/generate-tests", generateTestsAndAnalysis);

export default router;