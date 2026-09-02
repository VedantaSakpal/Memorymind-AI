import { useState } from 'react';

interface PromptPreset {
  id: string;
  label: string;
  query: string;
  response: string;
  sources: string[];
  latency: string;
}

const presets: PromptPreset[] = [
  {
    id: 'meeting',
    label: '📋 Summarize Q3 Strategy',
    query: 'What were the core decisions from our Q3 Product Roadmap sync?',
    response:
      'The team prioritized 3 initiatives: 1) Sub-second vector retrieval indexing, 2) Direct Obsidian & Notion bi-directional sync, and 3) End-to-end encrypted local embeddings.',
    sources: ['Meeting_Notes_Aug10.md', 'Q3_Roadmap.pdf'],
    latency: '0.018s',
  },
  {
    id: 'code',
    label: '⚡ Find Auth Token Helper',
    query: 'Where is the refresh token rotation logic implemented?',
    response:
      'Token rotation logic is located in `authService.ts` within `handleTokenRefresh()`. It uses HMAC-SHA256 with a 15-minute sliding session window.',
    sources: ['authService.ts:42', 'jwtConfig.json'],
    latency: '0.012s',
  },
  {
    id: 'research',
    label: '🧠 Connect PDF & Notion',
    query: 'Cross-reference my AI agent paper with my Notion architecture ideas',
    response:
      'Connected 4 related nodes: The memory retrieval pipeline matches your multi-agent architecture diagram in Notion with 94.6% semantic similarity.',
    sources: ['Agent_Survey_2026.pdf', 'Notion: Systems Architecture'],
    latency: '0.024s',
  },
];

export const HeroPromptDemo = () => {
  const [selectedPreset, setSelectedPreset] = useState<PromptPreset>(presets[0]);
  const [isAnswering, setIsAnswering] = useState(false);

  const handleSelect = (preset: PromptPreset) => {
    setIsAnswering(true);
    setSelectedPreset(preset);
    setTimeout(() => {
      setIsAnswering(false);
    }, 350);
  };

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-slate-200/90 bg-white/95 p-5 backdrop-blur-xl shadow-[0_15px_40px_rgba(13,91,90,0.1)] transition duration-300 hover:border-teal-400">
      {/* Top Interactive Prompt Pills */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <span className="text-xs font-bold text-[#0D5B5A] flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          Interactive Second Brain Query
        </span>
        <span className="text-[11px] font-mono text-slate-500">
          ⚡ Latency: {selectedPreset.latency}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => handleSelect(preset)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
              selectedPreset.id === preset.id
                ? 'bg-[#0D5B5A] text-white shadow-[0_4px_14px_rgba(13,91,90,0.3)] scale-[1.02]'
                : 'border border-slate-200 bg-slate-50 text-slate-600 hover:border-teal-300 hover:text-[#0C162C]'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Query Bar */}
      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 flex items-center gap-3">
        <span className="text-[#0D5B5A] text-sm">🔍</span>
        <span className="text-xs sm:text-sm font-medium text-slate-800 truncate">
          {selectedPreset.query}
        </span>
      </div>

      {/* Simulated Instant AI Response Box */}
      <div className="mt-3 rounded-xl border border-teal-500/20 bg-teal-50/50 p-3.5">
        <div className="flex items-center justify-between text-[11px] text-teal-800 pb-1.5">
          <span className="font-bold text-[#0C162C] flex items-center gap-1.5">
            <span className="flex h-4 w-4 items-center justify-center rounded-md bg-[#0D5B5A] text-white text-[10px]">
              ✨
            </span>
            MemoryMind AI Synthesis
          </span>
          <span className="rounded bg-emerald-500/20 text-emerald-700 px-1.5 py-0.5 font-mono text-[10px] font-bold">
            99.8% Match
          </span>
        </div>

        <p
          className={`mt-1.5 text-xs sm:text-sm text-slate-700 leading-relaxed transition-opacity duration-300 ${isAnswering ? 'opacity-30' : 'opacity-100'}`}
        >
          {selectedPreset.response}
        </p>

        {/* Citations & Sources */}
        <div className="mt-2.5 flex flex-wrap items-center gap-2 pt-2 border-t border-teal-500/20">
          <span className="text-[10px] font-semibold text-slate-500">Sources:</span>
          {selectedPreset.sources.map((src, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-md border border-teal-600/20 bg-white px-2 py-0.5 text-[10px] font-mono text-[#0D5B5A] shadow-xs"
            >
              📄 {src}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroPromptDemo;
