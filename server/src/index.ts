import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import connect_DB from "./config/db.js";

dotenv.config();
connect_DB();

const app = express();

// Enable CORS for Frontend communication
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

import projectRoutes from "./routes/project.routes.js";
import aiRoutes from "./routes/ai.routes.js";

app.use("/api/project", projectRoutes);
app.use("/api/ai", aiRoutes);

// CLI Executed Scan History Log Endpoint
app.get("/api/history", (req, res) => {
  const historyFilePath = path.join(process.cwd(), "..", ".testpilot-history.json");

  try {
    if (fs.existsSync(historyFilePath)) {
      const data = fs.readFileSync(historyFilePath, "utf-8");
      res.json(JSON.parse(data));
    } else {
      res.json([]);
    }
  } catch {
    res.status(500).json({ error: "Failed to read history log." });
  }
});

app.listen(port, () => {
  console.log(`\n ✅ Server running on http://localhost:${port}`);  
});