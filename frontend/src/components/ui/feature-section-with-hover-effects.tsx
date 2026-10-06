import { cn } from '@/utils';
import {
  IconMessageChatbot,
  IconFileText,
  IconCards,
  IconBrain,
  IconTopologyStar,
  IconFiles,
  IconDatabaseSearch,
  IconRocket,
} from '@tabler/icons-react';

const features = [
  {
    title: 'AI Document Chat',
    description:
      'Ask questions about your documents and get contextual answers powered by AI.',
    icon: <IconMessageChatbot size={28} stroke={1.5} />,
  },
  {
    title: 'Smart Summaries',
    description:
      'Turn long documents into concise, easy-to-understand summaries in seconds.',
    icon: <IconFileText size={28} stroke={1.5} />,
  },
  {
    title: 'AI Flashcards',
    description:
      'Automatically generate revision-ready flashcards from your study material.',
    icon: <IconCards size={28} stroke={1.5} />,
  },
  {
    title: 'Intelligent Quizzes',
    description:
      'Generate personalized quizzes from your documents and test your understanding.',
    icon: <IconBrain size={28} stroke={1.5} />,
  },
  {
    title: 'Knowledge Maps',
    description:
      'Visualize relationships between important concepts and ideas inside your documents.',
    icon: <IconTopologyStar size={28} stroke={1.5} />,
  },
  {
    title: 'Multi-Format Learning',
    description:
      'Upload PDFs, DOC, DOCX files and images and turn them into interactive learning material.',
    icon: <IconFiles size={28} stroke={1.5} />,
  },
  {
    title: 'RAG-Powered Answers',
    description:
      'Get grounded answers based on your uploaded knowledge instead of generic AI responses.',
    icon: <IconDatabaseSearch size={28} stroke={1.5} />,
  },
  {
    title: 'Learn Faster',
    description:
      'Transform passive reading into an active AI-powered learning experience.',
    icon: <IconRocket size={28} stroke={1.5} />,
  },
];

export function FeaturesSectionWithHoverEffects() {
  return (
    <section
      id="features"
      className="relative z-10 mx-auto max-w-[1400px] px-6 py-24 sm:px-10 lg:px-12"
    >
      {/* Background visual effect */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.015)_0%,transparent_70%)]" />

      <div className="mb-16 space-y-4 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#000000]">
          Powerful AI Learning
        </p>
        <h2 className="mx-auto max-w-3xl text-4xl font-extrabold text-[#111111] sm:text-5xl">
          Everything you need to learn from your documents.
        </h2>
        <p className="mx-auto max-w-2xl text-lg font-medium text-slate-600">
          MemoryMind AI turns your documents into an interactive knowledge
          system — helping you understand, remember, and learn faster.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <FeatureCard key={feature.title} feature={feature} index={index} />
        ))}
      </div>
    </section>
  );
}

const FeatureCard = ({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) => {
  return (
    <div
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 ease-out hover:border-[#111111]/30 hover:shadow-md animate-fade-in-up',
      )}
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'both',
      }}
    >
      {/* Hover Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#000000]/[0.02] to-transparent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" />

      <div className="relative z-10 mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 text-[#111111] transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.08] group-hover:border-[#000000]/10 group-hover:bg-[#000000]/5">
        {feature.icon}
      </div>

      <div className="relative z-10">
        <h3 className="mb-2 text-xl font-bold text-[#111111] transition-transform duration-300 ease-out group-hover:translate-x-1">
          {feature.title}
        </h3>
        <p className="text-sm leading-relaxed text-slate-600">
          {feature.description}
        </p>
      </div>
    </div>
  );
};
