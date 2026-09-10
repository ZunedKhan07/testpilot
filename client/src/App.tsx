import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { DocsView } from "./components/DocsView";
import { AuditForm } from "./components/AuditForm";
import { TechMapBadges } from "./components/TechMapBadges";
import { AnalysisResults } from "./components/AnalysisResults";
import { CliLogsView } from "./components/CliLogsView";
import { ContactView } from "./components/ContactView";
import type { ActiveTab, AnalysisResult, ScanLogEntry } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("hero");

  const [repoUrl, setRepoUrl] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const [techMap, setTechMap] = useState<Record<string, any> | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [cliLogs, setCliLogs] = useState<ScanLogEntry[]>([]);

  const fetchCliHistory = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/history");
      const data = await res.json();
      setCliLogs(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAnalysisResult(null);
    setTechMap(null);

    try {
      setStatusMessage("🔍 Analyzing Repository Architecture...");
      const projRes = await fetch("http://localhost:5000/api/project/analyze-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl, geminiApiKey }),
      });
      const projData = await projRes.json();

      if (!projData.success) throw new Error(projData.error || "Failed to analyze repo");

      setTechMap(projData.data.techMap);

      setStatusMessage("🤖 Generating AI Audit...");
      const aiRes = await fetch("http://localhost:5000/api/ai/generate-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: projData.data.projectId }),
      });
      const aiData = await aiRes.json();

      if (!aiData.success) throw new Error(aiData.error);

      let parsed = aiData.result;
      if (typeof parsed === "string") {
        try {
          parsed = JSON.parse(parsed.replace(/```json|```/g, "").trim());
        } catch {
          parsed = { summary: aiData.result };
        }
      }

      setAnalysisResult(parsed);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
      setStatusMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="px-6 py-8">
        {activeTab === "hero" && <Hero setActiveTab={setActiveTab} />}
        {activeTab === "docs" && <DocsView />}

        {activeTab === "audit" && (
          <div className="space-y-8 max-w-5xl mx-auto">
            <AuditForm
              repoUrl={repoUrl}
              setRepoUrl={setRepoUrl}
              geminiApiKey={geminiApiKey}
              setGeminiApiKey={setGeminiApiKey}
              loading={loading}
              statusMessage={statusMessage}
              onSubmit={handleStartAudit}
            />
            {techMap && <TechMapBadges techMap={techMap} />}
            {analysisResult && <AnalysisResults result={analysisResult} />}
          </div>
        )}

        {activeTab === "logs" && (
          <div className="max-w-5xl mx-auto">
            <CliLogsView logs={cliLogs} onRefresh={fetchCliHistory} />
          </div>
        )}

        {activeTab === "contact" && <ContactView />}
      </main>
    </div>
  );
}