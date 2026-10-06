const features = [
  {
    title: 'AI Chat',
    description: 'Interact naturally with your own knowledge.',
    icon: '💬',
  },
  {
    title: 'Semantic Search',
    description: 'Search by meaning rather than exact keywords.',
    icon: '🔎',
  },
  {
    title: 'Smart Summaries',
    description: 'Understand lengthy resources quickly.',
    icon: '🧾',
  },
  {
    title: 'Knowledge Graph',
    description: 'Discover relationships between concepts.',
    icon: '🕸️',
  },
  {
    title: 'Flashcards & Quizzes',
    description: 'Turn knowledge into revision material.',
    icon: '🧠',
  },
  {
    title: 'Personalized Revision',
    description: 'Know what to revise next.',
    icon: '📈',
  },
];

const FeaturesSection = () => (
  <section id="features" className="space-y-8">
    <div className="space-y-3 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#000000]">
        Everything your knowledge needs.
      </p>
      <h2 className="text-4xl font-extrabold text-[#111111] sm:text-5xl">
        A premium toolkit for your second brain.
      </h2>
    </div>
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="group relative overflow-hidden rounded-[2rem] border border-slate-200/90 bg-white/95 p-6 shadow-[0_15px_35px_rgba(0,0,0,0.07)] transition hover:-translate-y-1 hover:border-teal-400 hover:shadow-xl"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#000000] via-[#666666] to-[#999999] opacity-80" />
          <div className="relative z-10">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-3xl border border-teal-500/20 bg-teal-50/80 text-2xl shadow-sm transition group-hover:scale-110">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-[#111111]">{feature.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default FeaturesSection;
