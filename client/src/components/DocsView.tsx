import React, { useState } from "react";

export const DocsView: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const docSections = [
    {
      id: "install",
      step: "01",
      title: "CLI Tool Installation",
      description: "Install the TestPilot CLI globally to enable terminal-level access across your system.",
      code: "npm install -g testpilot-cli",
    },
    {
      id: "env-config",
      step: "02",
      title: "Configure Gemini API Key",
      description: "Export your Gemini API key as an environment variable or set it directly via the CLI prompt.",
      code: 'export GEMINI_API_KEY="your_gemini_api_key_here"\ntestpilot config set-key',
    },
    {
      id: "run-inspect",
      step: "03",
      title: "Execute Code Audit & Auto-Heal",
      description: "Trigger an automated security inspection and code self-healing pass on your target repository.",
      code: "testpilot inspect --path=./src --auto-fix",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-10">
      <div>
        <h2 className="text-3xl font-black text-white tracking-tight">
          CLI Documentation & Guides
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          Step-by-step instructions to integrate TestPilot directly into your local development workflow.
        </p>
      </div>

      <div className="space-y-6">
        {docSections.map((sec) => (
          <div 
            key={sec.id}
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition"
          >
            <div className="flex items-center space-x-3 mb-3">
              <span className="px-2.5 py-1 bg-indigo-950 text-indigo-400 border border-indigo-800/50 text-xs font-mono font-bold rounded-lg">
                STEP {sec.step}
              </span>
              <h3 className="text-lg font-bold text-white">{sec.title}</h3>
            </div>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">{sec.description}</p>

            {/* Code Block with Copy Action */}
            <div className="relative bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300">
              <pre className="overflow-x-auto">{sec.code}</pre>
              <button
                onClick={() => handleCopy(sec.code, sec.id)}
                className="absolute top-3 right-3 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans rounded-lg border border-slate-700 transition"
              >
                {copiedId === sec.id ? "✓ Copied!" : "Copy Code"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};