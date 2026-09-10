import React from "react";

interface TechMapBadgesProps {
  techMap: Record<string, any>;
}

export const TechMapBadges: React.FC<TechMapBadgesProps> = ({ techMap }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Detected Tech Architecture
      </h3>
      <div className="flex flex-wrap gap-2">
        {Object.entries(techMap).map(([key, value]) => (
          <span
            key={key}
            className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-md text-xs font-mono text-cyan-400"
          >
            {key}: <strong className="text-white">{String(value)}</strong>
          </span>
        ))}
      </div>
    </div>
  );
};