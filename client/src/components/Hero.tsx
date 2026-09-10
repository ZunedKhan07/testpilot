import React from "react";
import type { ActiveTab } from "../types";

interface HeroProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const Hero: React.FC<HeroProps> = ({ setActiveTab }) => {
  return (
    <div className="relative pt-10 pb-20 overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[200px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-5xl mx-auto text-center px-4 relative z-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/30 backdrop-blur-md mb-8">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-xs font-mono text-cyan-300 font-medium">
            AI-Driven Repository Inspection & Auto-Healing CLI
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6">
          Autonomous QA & Code Audit Engine <br />
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
            Powered by Gemini AI
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          TestPilot scans project architecture, catches silent breaking changes, verifies test suites, and provides instant fix recommendations directly in your terminal or web dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => setActiveTab("audit")}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-bold rounded-2xl shadow-xl shadow-cyan-500/20 hover:scale-[1.02] transition"
          >
            Launch Web Repo Audit
          </button>
          
          <button
            onClick={() => setActiveTab("docs")}
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 text-slate-300 font-semibold rounded-2xl hover:bg-slate-800 hover:text-white transition"
          >
            Explore CLI Docs & Commands
          </button>
        </div>

        {/* Terminal Interactive Visual */}
        <div className="max-w-3xl mx-auto rounded-2xl bg-slate-950 border border-slate-800/80 shadow-2xl text-left overflow-hidden font-mono text-xs">
          <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            </div>
            <span className="text-slate-500 text-[11px]">testpilot-cli execution session</span>
          </div>
          <div className="p-6 space-y-2.5 text-slate-300">
            <p><span className="text-fuchsia-400 font-bold">➜</span> <span className="text-cyan-300">testpilot inspect</span> --target=./server</p>
            <p className="text-slate-500">[09:42:10] Analyzing AST AST tree & Express route dependency graph...</p>
            <p className="text-amber-400">[WARN] Found unhandled promise rejection in route /api/v1/auth/login</p>
            <p className="text-indigo-400">[GEMINI] Querying fix strategy via Gemini API context...</p>
            <p className="text-emerald-400">[PATCH APPLIED] Added try-catch wrapper in server/controllers/authController.ts</p>
          </div>
        </div>
      </div>
    </div>
  );
};