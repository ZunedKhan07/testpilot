import React from "react";
import type { ActiveTab } from "../types";

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems: { id: ActiveTab; label: string; badge?: string }[] = [
    { id: "hero", label: "Overview" },
    { id: "docs", label: "Documentation" },
    { id: "audit", label: "Web Audit" },
    { id: "logs", label: "CLI Stream" },
    { id: "contact", label: "Contact & Roadmap" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-indigo-900/30 px-6 py-4 flex items-center justify-between">
      {/* Brand Logo & Name */}
      <div 
        onClick={() => setActiveTab("hero")}
        className="flex items-center space-x-3 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-fuchsia-500 p-[2px] transition group-hover:scale-105">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-cyan-400 font-mono text-lg">
            TP
          </div>
        </div>
        <div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-400 bg-clip-text text-transparent">
            TestPilot
          </span>
          <span className="text-[10px] font-mono text-slate-500 block uppercase tracking-widest -mt-1">
            Engine v1.0
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/80 border border-slate-800/80 p-1 rounded-2xl shadow-inner">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              activeTab === item.id
                ? "bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-md shadow-indigo-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Call to Action Button */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setActiveTab("audit")}
          className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 hover:opacity-90 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/10 transition transform hover:-translate-y-0.5"
        >
          Audit Repo Now 🚀
        </button>
      </div>
    </header>
  );
};