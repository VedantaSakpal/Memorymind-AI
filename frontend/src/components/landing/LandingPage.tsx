import { useState, useRef } from 'react';
import AskDemo from '@/components/AskDemo';
import NeuralConstellation from '@/components/landing/NeuralConstellation';
import TrustStrip from '@/components/landing/TrustStrip';
import { FeaturesSectionWithHoverEffects } from '@/components/ui/feature-section-with-hover-effects';

const heroStats = [
  { icon: 'file', title: '10+', subtitle: 'File types' },
  { icon: 'brain', title: 'AI powered', subtitle: 'Understands context' },
  { icon: 'shield', title: 'Secure', subtitle: 'Private by default' },
  { icon: 'lightning', title: 'Fast search', subtitle: 'Answers in seconds' },
];

const getStatIcon = (type: string) => {
  switch (type) {
    case 'file':
      return (
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#000000]" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="9" y1="13" x2="15" y2="13" />
          <line x1="9" y1="17" x2="13" y2="17" />
        </svg>
      );
    case 'brain':
      return (
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#000000]" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
          <circle cx="12" cy="7" r="1" fill="#666666" />
          <circle cx="12" cy="12" r="1" fill="#666666" />
          <circle cx="12" cy="17" r="1" fill="#666666" />
        </svg>
      );
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#000000]" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      );
    case 'lightning':
      return (
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#000000]" fill="none" stroke="currentColor" strokeWidth="1.8">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    default:
      return null;
  }
};

const LandingPage = () => {
  const [cursorPos, setCursorPos] = useState({ x: -1000, y: -1000 });
  const heroRef = useRef<HTMLDivElement | null>(null);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleHeroMouseLeave = () => {
    setCursorPos({ x: -1000, y: -1000 });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#F8FAFB] text-[#111111]">
      {/* Hero Section */}
      <div
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative"
      >
        <NeuralConstellation />
        {cursorPos.x > 0 && (
          <div
            style={{ transform: `translate(${cursorPos.x - 300}px, ${cursorPos.y - 300}px)`, transition: 'transform 0.1s ease-out' }}
            className="pointer-events-none absolute left-0 top-0 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_closest-side,rgba(102,102,102,0.12),transparent_100%)] blur-[60px]"
          />
        )}
        <div className="pointer-events-none absolute -top-40 right-1/4 h-[550px] w-[550px] rounded-full bg-teal-500/10 blur-[130px] animate-pulse-glow" />
        <div className="pointer-events-none absolute top-1/4 left-0 h-[600px] w-[600px] rounded-full bg-cyan-500/08 blur-[150px]" />
        
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 pt-8 pb-16 sm:px-10 lg:px-12 lg:pt-12 lg:pb-24">
          <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
            <div className="flex flex-col items-start space-y-6 sm:space-y-8">
              <div className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight text-[#111111] sm:text-6xl xl:text-[4.25rem] leading-[1.08]">
                  Remember everything.
                </h1>
                <h2 className="text-4xl font-extrabold tracking-tight text-[#111111] sm:text-6xl xl:text-[4.25rem] leading-[1.08]">
                  Forget nothing.
                </h2>
              </div>
              <p className="max-w-xl text-base sm:text-lg leading-relaxed text-slate-600 font-normal">
                Your second brain. Save notes, documents and ideas, then ask questions in plain language.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a href="#get-started" className="relative group overflow-hidden inline-flex items-center justify-center rounded-full bg-[#000000] px-8 py-3.5 text-base font-semibold text-white shadow-[0_8px_25px_rgba(0,0,0,0.35)] transition duration-300 hover:bg-[#000000] hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)] hover:scale-[1.02] active:scale-[0.98]">
                  <span className="relative z-10 flex items-center gap-2">Get started free</span>
                </a>
                <a href="#demo" className="inline-flex items-center justify-center rounded-full border-2 border-[#111111] bg-white px-8 py-3.5 text-base font-semibold text-[#111111] shadow-sm transition duration-300 hover:bg-slate-50 hover:shadow-md active:scale-[0.98]">
                  Watch demo
                </a>
              </div>
            </div>
            <div className="relative flex items-center justify-center lg:sticky lg:top-24">
              <AskDemo />
            </div>
          </section>

          <div className="relative mt-14 sm:mt-20 overflow-hidden rounded-2xl p-[1px] shadow-lg">
            <div className="absolute -inset-[150%] animate-conic-spin bg-[conic-gradient(from_0deg,_transparent_0_300deg,_#666666_330deg,_#000000_360deg)] opacity-60" />
            <div className="relative rounded-2xl bg-white/90 p-5 sm:p-7 backdrop-blur-2xl border border-slate-200/80">
              <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80">
                {heroStats.map((stat, idx) => (
                  <div key={stat.title} className={`group flex items-center gap-4 transition-transform duration-300 hover:translate-y-[-2px] ${idx > 0 && idx % 2 === 0 ? 'pt-4 lg:pt-0' : ''} ${idx > 1 ? 'pt-4 lg:pt-0' : ''} ${idx !== 0 ? 'lg:pl-8' : ''}`}>
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-[#000000]/20 bg-[#000000]/10 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:border-[#000000]/40 group-hover:shadow-[0_0_20px_rgba(0,0,0,0.25)]">
                      {getStatIcon(stat.icon)}
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111] group-hover:text-[#000000] transition-colors">{stat.title}</div>
                      <div className="text-xs sm:text-sm font-medium text-slate-500">{stat.subtitle}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <TrustStrip />

      {/* Features Section */}
      <FeaturesSectionWithHoverEffects />

      {/* Workflow Section */}
      <section id="workflow" className="bg-[#111111] text-white py-24 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#000000]/20 via-[#111111] to-[#111111] opacity-50"></div>
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-12 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-extrabold sm:text-5xl">How it works</h2>
            <p className="text-lg text-slate-300 font-medium">Three steps, no setup.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Upload', desc: 'Drop in files or write a note.', icon: '1' },
              { title: 'Understand', desc: 'AI reads, summarizes and connects your content.', icon: '2' },
              { title: 'Ask', desc: 'Get answers and find anything instantly.', icon: '3' }
            ].map((step, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 shadow-xl group-hover:scale-110 group-hover:border-white/30 group-hover:bg-white/10 transition-all duration-300">{step.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-slate-300 text-lg leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="mx-auto max-w-[1400px] px-6 py-24 sm:px-10 lg:px-12 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-extrabold text-[#111111] sm:text-5xl">Simple pricing</h2>
          <p className="text-lg text-slate-600 font-medium">Start free. Upgrade when your memory grows.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 lg:p-12 border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-2xl font-bold text-[#111111] mb-2">Free</h3>
            <div className="text-5xl font-extrabold text-[#111111] mb-8">$0</div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center text-slate-600"><span className="text-[#000000] mr-3">✓</span> 100 items</li>
              <li className="flex items-center text-slate-600"><span className="text-[#000000] mr-3">✓</span> AI search</li>
              <li className="flex items-center text-slate-600"><span className="text-[#000000] mr-3">✓</span> Basic summaries</li>
            </ul>
            <a href="/dashboard" className="block text-center w-full rounded-full border-2 border-[#111111] bg-white px-8 py-3.5 text-base font-semibold text-[#111111] transition hover:bg-slate-50">Start free</a>
          </div>
          <div className="bg-[#111111] text-white rounded-3xl p-8 lg:p-12 border border-[#111111] shadow-2xl relative flex flex-col transform md:-translate-y-4">
            <div className="absolute top-0 right-8 transform -translate-y-1/2">
              <span className="bg-[#000000] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Popular</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <div className="text-5xl font-extrabold mb-2">$9</div>
            <div className="text-slate-400 mb-6">/ month</div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center text-slate-200"><span className="text-[#666666] mr-3">✓</span> Unlimited items</li>
              <li className="flex items-center text-slate-200"><span className="text-[#666666] mr-3">✓</span> Advanced AI answers</li>
              <li className="flex items-center text-slate-200"><span className="text-[#666666] mr-3">✓</span> Priority processing</li>
            </ul>
            <a href="/dashboard" className="block text-center w-full rounded-full bg-[#000000] px-8 py-3.5 text-base font-semibold text-white transition hover:bg-[#000000]">Go Pro</a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#000000] text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="mx-auto max-w-4xl px-6 text-center relative z-10 space-y-8">
          <h2 className="text-5xl font-extrabold sm:text-6xl">Give your mind some room.</h2>
          <a href="/dashboard" className="inline-block rounded-full bg-white px-10 py-4 text-lg font-bold text-[#000000] shadow-xl transition hover:scale-105">Get started free</a>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;

