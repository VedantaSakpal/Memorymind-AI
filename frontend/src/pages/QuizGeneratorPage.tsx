import { useState } from 'react';

interface QuizQuestion {
  id: number;
  question: string;
  options: { key: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

const sampleQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Which of the following is a type of Supervised Learning?',
    options: [
      { key: 'A', text: 'K-Means' },
      { key: 'B', text: 'Linear Regression' },
      { key: 'C', text: 'PCA' },
      { key: 'D', text: 'Apriori' },
    ],
    correctAnswer: 'B',
    explanation:
      'Linear Regression models the relationship between continuous dependent targets and independent features using labelled data.',
  },
  {
    id: 2,
    question:
      'Which activation function is most commonly used in hidden layers of modern Deep Neural Networks?',
    options: [
      { key: 'A', text: 'Sigmoid' },
      { key: 'B', text: 'Softmax' },
      { key: 'C', text: 'ReLU (Rectified Linear Unit)' },
      { key: 'D', text: 'Step Function' },
    ],
    correctAnswer: 'C',
    explanation:
      'ReLU avoids vanishing gradients and allows for fast computational training compared to saturating functions like Sigmoid.',
  },
  {
    id: 3,
    question:
      'In Decision Trees, which metric is commonly used to measure impurity in classification splits?',
    options: [
      { key: 'A', text: 'Gini Impurity & Entropy' },
      { key: 'B', text: 'Mean Squared Error' },
      { key: 'C', text: 'Cosine Similarity' },
      { key: 'D', text: 'L1 Regularization' },
    ],
    correctAnswer: 'A',
    explanation:
      'Information Gain via Entropy and Gini Impurity quantify the homogeneity of node partitions.',
  },
];

const QuizGeneratorPage = () => {
  const [selectedSource, setSelectedSource] = useState('Machine Learning Notes.pdf');
  const [questionType, setQuestionType] = useState('Multiple Choice');
  const [questionCount, setQuestionCount] = useState('10');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>('B');
  const [isGenerating, setIsGenerating] = useState(false);

  const currentQ = sampleQuestions[currentQuestionIndex % sampleQuestions.length];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setCurrentQuestionIndex(0);
      setSelectedOption('B');
    }, 500);
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % sampleQuestions.length);
    setSelectedOption(null);
  };

  const handlePrev = () => {
    setCurrentQuestionIndex((prev) =>
      prev === 0 ? sampleQuestions.length - 1 : prev - 1,
    );
    setSelectedOption(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Quiz Generator
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Test your knowledge with AI generated quizzes.
        </p>
      </div>

      {/* Generator Controls Bar matching reference */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
          {/* Select Source */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Select Source
            </label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-[#F8F9FC] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#000000] focus:bg-white focus:outline-none"
            >
              <option>Machine Learning Notes.pdf</option>
              <option>Deep Learning Notes.pdf</option>
              <option>Operating Systems.pdf</option>
              <option>Data Structures.docx</option>
            </select>
          </div>

          {/* Question Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Question Type
            </label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-[#F8F9FC] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#000000] focus:bg-white focus:outline-none"
            >
              <option>Multiple Choice</option>
              <option>True / False</option>
              <option>Short Answer</option>
            </select>
          </div>

          {/* Number of Questions */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Number of Questions
            </label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-[#F8F9FC] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#000000] focus:bg-white focus:outline-none"
            >
              <option>10</option>
              <option>15</option>
              <option>20</option>
              <option>25</option>
            </select>
          </div>

          {/* Generate Button */}
          <div>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full rounded-xl bg-[#000000] py-2.5 px-4 text-xs sm:text-sm font-bold text-white shadow-[0_4px_16px_rgba(0,0,0,0.35)] transition hover:bg-[#000000] active:scale-[0.98] disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Generate Quiz'}
            </button>
          </div>
        </div>
      </div>

      {/* Question Card matching reference */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm space-y-6">
        {/* Question Prompt */}
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            {currentQuestionIndex + 1}. {currentQ.question}
          </h2>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {currentQ.options.map((option) => {
            const isSelected = selectedOption === option.key;
            const isCorrect = option.key === currentQ.correctAnswer;

            let optionStyle =
              'border-slate-200 bg-white hover:border-slate-300 text-slate-700';

            if (isSelected) {
              if (isCorrect) {
                // Green highlighted style matching reference screenshot panel 9!
                optionStyle =
                  'border-emerald-500 bg-emerald-50/80 text-emerald-900 font-semibold shadow-sm ring-1 ring-emerald-500';
              } else {
                optionStyle =
                  'border-rose-500 bg-rose-50/80 text-rose-900 font-semibold';
              }
            }

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => setSelectedOption(option.key)}
                className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left text-xs sm:text-sm transition duration-200 ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs font-bold ${
                      isSelected && isCorrect
                        ? 'bg-emerald-500 text-white'
                        : isSelected && !isCorrect
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {option.key}
                  </span>
                  <span>{option.text}</span>
                </div>

                {isSelected && isCorrect && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-xs">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Card */}
        {selectedOption && (
          <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/50 p-4 text-xs text-slate-700">
            <p className="font-bold text-emerald-800 mb-1">AI Explanation:</p>
            <p className="leading-relaxed text-slate-600">{currentQ.explanation}</p>
          </div>
        )}

        {/* Bottom Navigation matching reference */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-6">
          <button
            type="button"
            onClick={handlePrev}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Previous
          </button>

          <span className="text-xs font-bold text-slate-400 font-mono">
            {currentQuestionIndex + 1} / 10
          </span>

          <button
            type="button"
            onClick={handleNext}
            className="rounded-xl bg-[#000000] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-[0_4px_16px_rgba(0,0,0,0.35)] transition hover:bg-[#000000]"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizGeneratorPage;
