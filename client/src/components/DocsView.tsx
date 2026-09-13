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
      title: "Global Installation",
      description: "Install TestPilot CLI globally on your system to run commands from any project workspace.",
      code: "npm install -g testpilot",
    },
    {
      id: "init",
      step: "02",
      title: "Initialize TestPilot CLI",
      description: "Run the interactive setup in your project root to configure the backend server URL and Gemini API key.",
      code: "npx testpilot init",
    },
    {
      id: "scan",
      step: "03",
      title: "Run QA Scan & Auto-Fix Engine",
      description: "Scan modified Git workspace files, trigger automated Playwright tests, and apply Gemini AI auto-fixes with safe rollback.",
      code: "npx testpilot scan",
    },
  ];

  const geminiSteps = [
    {
      step: "1",
      title: "Visit Google AI Studio",
      desc: "Open Google AI Studio dashboard to manage your API credentials.",
      link: "https://aistudio.google.com/app/apikey",
    },
    {
      step: "2",
      title: "Create API Key",
      desc: "Click on 'Create API key' button and select your preferred Google Cloud project.",
    },
    {
      step: "3",
      title: "Copy & Use Key",
      desc: "Copy the generated API key and paste it during 'npx testpilot init' prompt setup.",
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

      {/* CLI Workflow Steps */}
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

      {/* How to Get Gemini API Key Section */}
      <div className="bg-slate-900/40 border border-cyan-900/40 rounded-2xl p-6 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <span>🔑 How to Get Your Gemini API Key</span>
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Follow these steps to generate a free Gemini API key for running TestPilot audits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {geminiSteps.map((item) => (
            <div 
              key={item.step}
              className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between"
            >
              <div>
                <span className="inline-block px-2 py-0.5 bg-cyan-950 text-cyan-400 border border-cyan-800/50 text-xs font-mono font-bold rounded mb-2">
                  Step 0{item.step}
                </span>
                <h4 className="text-sm font-bold text-slate-200 mb-1">{item.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed mb-3">{item.desc}</p>
              </div>

              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-cyan-400 hover:text-cyan-300 font-medium underline underline-offset-4"
                >
                  Open Google AI Studio ↗
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};