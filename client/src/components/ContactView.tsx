import React, { useState } from "react";

export const ContactView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const email = "zunedkhan107@gmail.com";

  // Direct Web Gmail Compose URL
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(
    "TestPilot Inquiry & Feedback"
  )}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-10">
      {/* Contact Header */}
      <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl text-center space-y-4">
        <h2 className="text-2xl font-black text-white">Connect with the Lead Developer</h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Reach out for inquiries regarding the TestPilot architecture, custom enterprise integrations, or feedback on AI Code Audits.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {/* Direct Gmail Compose Button */}
          <a
            href={gmailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-indigo-600/20"
          >
            <span>✉️</span>
            <span> zunedkhan107@gmail.com </span>
          </a>

          {/* Copy Email Quick Action */}
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm rounded-xl border border-slate-700 transition"
          >
            <span>{copied ? "✓ Copied!" : "📋 Copy Email Address"}</span>
          </button>
        </div>
      </div>

      {/* Coming Soon Features */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Upcoming Platform Modules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
            <span className="absolute top-4 right-4 px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
              COMING SOON
            </span>
            <h4 className="text-base font-bold text-white mb-2">Automated GitHub PR Healing</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Automated pull request fix generation directly dispatched into your GitHub repositories upon detecting critical bugs.
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
            <span className="absolute top-4 right-4 px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
              COMING SOON
            </span>
            <h4 className="text-base font-bold text-white mb-2">VS Code Inline Inspector</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              An IDE extension enabling real-time bug flagging and inline unit-test generation powered by the Gemini API.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};