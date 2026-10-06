const tickerItems = [
  {
    icon: '🧠',
    text: 'Vector index updated: 14,200 memories synchronized',
    tag: 'SYNC',
  },
  {
    icon: '⚡',
    text: 'Semantic search completed in 18ms across 52 documents',
    tag: 'SEARCH',
  },
  {
    icon: '🔒',
    text: 'Zero-knowledge end-to-end encryption verified',
    tag: 'SECURITY',
  },
  {
    icon: '📄',
    text: 'Notion & Obsidian graph cross-referenced: 84 new links',
    tag: 'GRAPH',
  },
  { icon: '✨', text: 'Second Brain recall accuracy rated 99.8%', tag: 'AI CORE' },
];

export const LiveActivityTicker = () => {
  return (
    <div className="w-full overflow-hidden border-y border-teal-500/20 bg-white/80 py-2.5 backdrop-blur-md">
      <div className="animate-ticker-slide flex items-center gap-10">
        {[...tickerItems, ...tickerItems].map((item, idx) => (
          <div
            key={idx}
            className="flex flex-shrink-0 items-center gap-3 text-xs font-medium text-slate-700"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-sm">
              {item.icon}
            </span>
            <span>{item.text}</span>
            <span className="rounded-md border border-teal-600/20 bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-[#000000] uppercase tracking-wider">
              {item.tag}
            </span>
            <span className="text-teal-400">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveActivityTicker;
