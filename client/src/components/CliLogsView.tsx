import React from "react";
import type { ScanLogEntry } from "../types";

interface CliLogsViewProps {
  logs: ScanLogEntry[];
  onRefresh: () => void;
}

export const CliLogsView: React.FC<CliLogsViewProps> = ({ logs, onRefresh }) => {
  const totalScans = logs.length;
  const fixedCount = logs.filter((l) => l.status === "FIXED").length;
  const rolledBackCount = logs.filter((l) => l.status === "ROLLED_BACK").length;

  return (
    <div className="space-y-6">
      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-slate-400 text-sm">Total Scans</h3>
          <p className="text-4xl font-extrabold text-white mt-2">{totalScans}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-slate-400 text-sm">Auto-Repaired</h3>
          <p className="text-4xl font-extrabold text-green-400 mt-2">{fixedCount}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-slate-400 text-sm">Rollbacks Triggered</h3>
          <p className="text-4xl font-extrabold text-yellow-400 mt-2">{rolledBackCount}</p>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">CLI Execution Logs</h2>
          <button
            onClick={onRefresh}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded text-xs text-white transition"
          >
            🔄 Refresh
          </button>
        </div>
        <div className="divide-y divide-slate-800">
          {logs.length === 0 ? (
            <div className="p-6 text-center text-slate-500">No CLI logs recorded yet.</div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-6 flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-cyan-400 font-semibold">{log.filePath}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        log.status === "PASSED"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : log.status === "FIXED"
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mt-1">
                    {log.explanation || "Test passed cleanly without errors."}
                  </p>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};