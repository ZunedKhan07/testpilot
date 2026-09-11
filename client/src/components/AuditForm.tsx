import React from "react";

interface AuditFormProps {
  repoUrl: string;
  setRepoUrl: (val: string) => void;
  geminiApiKey: string;
  setGeminiApiKey: (val: string) => void;
  loading: boolean;
  statusMessage: string;
  onSubmit: (e: React.FormEvent) => void;
}

export const AuditForm: React.FC<AuditFormProps> = ({
  repoUrl,
  setRepoUrl,
  geminiApiKey,
  setGeminiApiKey,
  loading,
  statusMessage,
  onSubmit,
}) => {
  return (
    <div className="bg-slate-900/70 border border-slate-800 p-8 rounded-3xl max-w-3xl mx-auto shadow-2xl backdrop-blur-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white">Web Repository Inspector</h2>
        <p className="text-slate-400 text-xs mt-1">Provide public GitHub repo link & your Gemini key to start scanning.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            GitHub Repository Link
          </label>
          <input
            type="url"
            placeholder="https://github.com/username/repository"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            autoComplete="off"
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Gemini API Key
          </label>
          <input
            type="password"
            placeholder="AIzaSy..."
            value={geminiApiKey}
            onChange={(e) => setGeminiApiKey(e.target.value)}
            autoComplete="off"
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          />

          {/* Trust & Security Banner */}
          <div className="mt-3 p-3.5 bg-slate-950/80 border border-emerald-500/30 rounded-xl flex items-start space-x-3">
            <span className="text-emerald-400 text-sm">🔒</span>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-emerald-400 font-semibold">Zero Storage Policy:</strong> Your Gemini API key is processed strictly in-memory during runtime execution. We **never store, cache, or persist** API keys in databases, server logs, or local storage.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 hover:opacity-95 text-slate-950 font-black rounded-xl shadow-lg shadow-cyan-500/10 transition"
        >
          {loading ? "Analyzing Repository Architecture..." : "🚀 Run Full Architecture Scan"}
        </button>
      </form>

      {statusMessage && (
        <div className="mt-6 p-4 bg-indigo-950/50 border border-indigo-500/30 text-indigo-300 text-xs font-mono rounded-xl animate-pulse">
          {statusMessage}
        </div>
      )}
    </div>
  );
};