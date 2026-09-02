import { useState } from 'react';

interface FlashcardItem {
  id: number;
  question: string;
  answer: string;
  source: string;
  category: string;
}

const flashcardDeck: FlashcardItem[] = [
  {
    id: 1,
    question: 'What is the difference between Supervised and Unsupervised Learning?',
    answer:
      'Supervised Learning uses labeled training data where each input is paired with the correct output target. In contrast, Unsupervised Learning explores unlabeled data to discover hidden patterns, clusters, or latent data distributions without explicit teacher signals.',
    source: 'Machine Learning Basics.pdf',
    category: 'Core ML Concepts',
  },
  {
    id: 2,
    question: 'How does backpropagation update weights in a Deep Neural Network?',
    answer:
      'Backpropagation computes the gradient of the loss function with respect to each weight via the Chain Rule of calculus, propagating error backwards from the output layer to hidden layers to update weights using gradient descent.',
    source: 'Deep Learning Notes.pdf',
    category: 'Optimization',
  },
  {
    id: 3,
    question: 'What is the primary trade-off in the Bias-Variance dilemma?',
    answer:
      'High bias leads to underfitting (oversimplifying assumptions), while high variance leads to overfitting (capturing noise in training data). The goal is to minimize total generalization error at optimal model complexity.',
    source: 'ML Notes Sem 6.pdf',
    category: 'Statistical Learning',
  },
];

const flashcardStats = [
  {
    title: 'Total Cards',
    value: '356',
    icon: (
      <svg
        className="h-5 w-5 text-[#0D5B5A]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="2" y="7" width="16" height="14" rx="2" />
        <path d="M6 3h12a2 2 0 0 1 2 2v12" />
      </svg>
    ),
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-100',
  },
  {
    title: 'Due Today',
    value: '28',
    icon: (
      <svg
        className="h-5 w-5 text-amber-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-100',
  },
  {
    title: 'Learned',
    value: '142',
    icon: (
      <svg
        className="h-5 w-5 text-emerald-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="9 11 12 14 22 4" />
      </svg>
    ),
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-100',
  },
  {
    title: 'Accuracy',
    value: '85%',
    icon: (
      <svg
        className="h-5 w-5 text-blue-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 20V10" />
        <path d="M18 20V4" />
        <path d="M6 20v-4" />
      </svg>
    ),
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
  },
];

const FlashcardsPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = flashcardDeck[currentIndex % flashcardDeck.length];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcardDeck.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev === 0 ? flashcardDeck.length - 1 : prev - 1));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Flashcards
        </h1>
        <p className="mt-1 text-sm text-slate-500">Review and master your concepts.</p>
      </div>

      {/* 4 Statistics Cards matching reference */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 sm:gap-6">
        {flashcardStats.map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.bgColor} border ${item.borderColor} flex-shrink-0`}
            >
              {item.icon}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {item.title}
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Flashcard Card matching reference */}
      <div className="mx-auto max-w-3xl">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="relative min-h-[320px] cursor-pointer rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-12 shadow-sm transition-all hover:shadow-md flex flex-col justify-between"
        >
          {/* Top Tag & Close Icon */}
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-[#0D5B5A] border border-teal-200/60">
              {currentCard.category}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Click anywhere to {isFlipped ? 'show question' : 'flip answer'} 🔄
            </span>
          </div>

          {/* Flashcard Content */}
          <div className="my-8 text-center">
            {!isFlipped ? (
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold leading-relaxed text-slate-900">
                  {currentCard.question}
                </h2>
                <p className="text-xs text-slate-400">Source: {currentCard.source}</p>
              </div>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  ✓ Answer Explanation
                </p>
                <p className="text-base sm:text-lg leading-relaxed text-slate-800">
                  {currentCard.answer}
                </p>
              </div>
            )}
          </div>

          {/* Card Counter Footer */}
          <div className="flex items-center justify-center border-t border-slate-100 pt-4">
            <span className="text-xs font-bold text-slate-500 font-mono">
              {currentIndex + 1} / 356
            </span>
          </div>
        </div>

        {/* Bottom Action Controls matching reference */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrevious}
            className="flex-1 rounded-2xl bg-rose-500 py-3 text-center text-sm font-bold text-white shadow-sm transition hover:bg-rose-600 active:scale-[0.98]"
          >
            Again
          </button>

          <button
            type="button"
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex-1 rounded-2xl border border-slate-300 bg-white py-3 text-center text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-400 active:scale-[0.98]"
          >
            Mark as Known
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="flex-1 rounded-2xl bg-emerald-500 py-3 text-center text-sm font-bold text-white shadow-sm transition hover:bg-emerald-600 active:scale-[0.98]"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardsPage;
