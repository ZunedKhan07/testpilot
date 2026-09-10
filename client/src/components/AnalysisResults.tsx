import React from "react";
import type { AnalysisResult } from "../types/index";

interface AnalysisResultsProps {
  result: AnalysisResult;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result }) => {
  return (
    <div className="space-y-6">
      {result.summary && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-2">Audit Executive Summary</h3>
          <p className="text-slate-300 text-sm whitespace-pre-line leading-relaxed">
            {result.summary}
          </p>
        </div>
      )}

      {result.issues && result.issues.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800">
            <h3 className="text-lg font-semibold text-white">Reported Issues & Fixes</h3>
          </div>
          <div className="divide-y divide-slate-800">
            {result.issues.map((item, idx) => (
              <div key={idx} className="p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      item.priority === "IMPORTANT"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : item.priority === "RECOMMENDED"
                        ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                        : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                    }`}
                  >
                    {item.priority === "IMPORTANT"
                      ? "🔴 Important"
                      : item.priority === "RECOMMENDED"
                      ? "🟡 Recommended"
                      : "⚪ Optional"}
                  </span>
                  <h4 className="font-semibold text-white text-base">{item.title}</h4>
                </div>
                <p className="text-slate-400 text-sm mb-3">{item.description}</p>
                {item.suggestedFix && (
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-green-400 overflow-x-auto">
                    <code>{item.suggestedFix}</code>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};