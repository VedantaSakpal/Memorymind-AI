interface OrbitNode {
  name: string;
  icon: string;
  status: string;
  className: string;
}

const orbitNodes: OrbitNode[] = [
  { name: 'Notion', icon: '📝', status: 'Sync Active', className: 'animate-orbit-1' },
  { name: 'GitHub', icon: '🐙', status: '48 Repos', className: 'animate-orbit-2' },
  { name: 'PDF Docs', icon: '📑', status: '120 Files', className: 'animate-orbit-3' },
];

export const OrbitingSources = () => {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {orbitNodes.map((node) => (
        <div
          key={node.name}
          className={`pointer-events-auto absolute flex items-center justify-center rounded-2xl border border-slate-200/90 bg-white/95 p-2.5 shadow-[0_8px_20px_rgba(0,0,0,0.12)] backdrop-blur-md transition-all duration-300 hover:scale-125 hover:border-teal-400 hover:shadow-[0_12px_30px_rgba(102,102,102,0.25)] cursor-pointer group ${node.className}`}
        >
          <span className="text-base select-none">{node.icon}</span>

          {/* Hover Tooltip */}
          <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-teal-500/30 bg-[#111111] px-2 py-0.5 text-[10px] font-semibold text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
            {node.name} • {node.status}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrbitingSources;
