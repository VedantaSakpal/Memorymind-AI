import { useState, useEffect, useRef } from 'react';
import OrbitingSources from '@/components/landing/OrbitingSources';

const HeroVisual = () => {
  const [pulseCount, setPulseCount] = useState(12840);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseCount((prev) => prev + Math.floor(Math.random() * 5));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div className="relative mx-auto flex w-full max-w-[700px] flex-col items-center justify-center select-none">
      {/* 3D Visual Viewport */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: 1200 }}
        className="relative flex w-full items-center justify-center"
      >
        {/* Ambient background teal & cyan glows */}
        <div
          style={{
            transform: `translate3d(${tilt.rotateY * 1.5}px, ${-tilt.rotateX * 1.5}px, 0)`,
            transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
          className="pointer-events-none absolute -top-16 left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-teal-500/20 via-cyan-400/15 to-emerald-400/15 blur-[110px] animate-pulse-glow"
        />
        <div className="pointer-events-none absolute -bottom-10 left-1/2 h-[280px] w-[540px] -translate-x-1/2 rounded-full bg-teal-600/10 blur-[100px]" />

        {/* Main 3D Container */}
        <div
          style={{
            transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.15s ease-out',
          }}
          className="relative z-10 w-full"
        >
          {/* Base Pulse Ring Effect in Mint */}
          <div className="pointer-events-none absolute bottom-12 left-1/2 h-28 w-64 -translate-x-1/2 rounded-full border border-teal-500/40 bg-teal-500/10 blur-sm animate-ring-expand" />

          {/* Orbiting Knowledge Sources */}
          <OrbitingSources />

          {/* NEURAL 3D BRAIN HOLOGRAM */}
          <div className="relative overflow-visible group">
            <img
              src="/hero-brain.png"
              alt="MemoryMind AI 3D Brain Hologram"
              style={{ transform: 'translateZ(30px)' }}
              className="w-full h-auto object-contain transition-transform duration-700 ease-out drop-shadow-[0_0_50px_rgba(102,102,102,0.35)]"
              loading="eager"
            />

            {/* Holographic Laser Scan Line in Electric Cyan */}
            <div
              style={{ transform: 'translateZ(45px)' }}
              className="pointer-events-none absolute inset-x-[15%] h-[2px] bg-gradient-to-r from-transparent via-cyan-400 via-teal-300 to-transparent shadow-[0_0_15px_#999999] animate-scan-laser"
            />

            {/* Floating UI Card 1: Right Knowledge Card (Frosted White & Navy Text) */}
            <div
              style={{
                transform: `translate3d(${tilt.rotateY * -0.6}px, ${tilt.rotateX * 0.6}px, 60px)`,
                transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
              className="absolute -right-2 sm:right-2 top-[38%] z-20 w-[210px] sm:w-[250px] rounded-2xl border border-slate-200/90 bg-white/95 p-3.5 sm:p-4 backdrop-blur-xl shadow-[0_20px_45px_rgba(0,0,0,0.14),0_0_25px_rgba(102,102,102,0.12)] transition-colors duration-300 hover:border-teal-400 cursor-pointer animate-float-reverse"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#000000]">
                    Neural Stream
                  </span>
                </div>
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-teal-50 text-[#000000]">
                  <svg
                    className="h-3 w-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
              </div>

              <div className="mt-2.5 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Indexed Nodes</span>
                  <span className="font-mono font-bold text-[#111111]">
                    {pulseCount.toLocaleString()}
                  </span>
                </div>

                <div className="flex h-6 items-end gap-1 rounded-lg bg-slate-100/90 px-2 py-1">
                  {[40, 75, 55, 90, 65, 80, 45, 95, 70, 85, 60].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className={`w-full rounded-full bg-gradient-to-t from-[#000000] to-[#666666] transition-all duration-500 ${
                        i % 2 === 0 ? 'opacity-95' : 'opacity-70'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#666666]" />
                    Latency 0.02s
                  </span>
                  <span className="font-bold text-[#000000]">Sync: 100%</span>
                </div>
              </div>
            </div>

            {/* Floating UI Card 2: Top-Left Instant Semantic Search Bubble (Frosted White) */}
            <div
              style={{
                transform: `translate3d(${tilt.rotateY * -0.8}px, ${tilt.rotateX * 0.8}px, 50px)`,
                transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
              className="absolute -left-2 sm:left-2 top-[12%] z-20 hidden sm:flex items-center gap-2.5 rounded-2xl border border-slate-200/90 bg-white/95 px-3.5 py-2.5 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.12),0_0_20px_rgba(102,102,102,0.1)] transition-colors duration-300 hover:border-teal-400 animate-float-slow"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#000000] text-white shadow-sm">
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#111111] leading-tight">
                  Semantic Recall
                </p>
                <p className="text-[10px] font-medium text-slate-500">
                  Context Aware Search
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroVisual;
