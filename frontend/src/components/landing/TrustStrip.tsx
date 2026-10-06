const sources = [
  { label: 'PDFs', icon: '📄' },
  { label: 'Notes', icon: '📝' },
  { label: 'Videos', icon: '🎥' },
  { label: 'Websites', icon: '🌐' },
];

const TrustStrip = () => (
  <section
    className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-12 relative z-10 py-12"
    id="about"
  >
    <div className="rounded-[2.5rem] border border-[#E5E5E5] bg-[#FFFFFF] p-8 lg:p-10 shadow-sm flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="max-w-xl">
        <p className="text-sm uppercase tracking-[0.3em] font-bold text-[#666666]">
          Unified knowledge sources
        </p>
        <p className="mt-3 text-2xl font-bold text-[#111111] leading-snug">
          Bring every document, note, and clip into one connected AI system. MemoryMind organizes it all automatically.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        {sources.map((source) => (
          <div
            key={source.label}
            className="inline-flex items-center gap-3 rounded-full border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-2.5 text-sm font-semibold text-[#111111] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#FFFFFF] border border-[#E5E5E5] text-sm shadow-sm">
              {source.icon}
            </span>
            {source.label}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustStrip;
