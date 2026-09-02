import { Link } from 'react-router-dom';

const stats = [
  {
    title: 'Documents',
    value: '128',
    change: '+12 this week',
    isPositive: true,
    color: 'teal',
    icon: (
      <svg
        className="h-5 w-5 text-[#0D5B5A]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    title: 'Flashcards',
    value: '356',
    change: '+28 this week',
    isPositive: true,
    color: 'blue',
    icon: (
      <svg
        className="h-5 w-5 text-sky-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="2" y="7" width="16" height="14" rx="2" />
        <path d="M6 3h12a2 2 0 0 1 2 2v12" />
      </svg>
    ),
  },
  {
    title: 'Quizzes',
    value: '24',
    change: '+5 this week',
    isPositive: true,
    color: 'emerald',
    icon: (
      <svg
        className="h-5 w-5 text-emerald-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    title: 'Hours Studied',
    value: '18.5h',
    change: '+2.4h vs last week',
    isPositive: true,
    color: 'amber',
    icon: (
      <svg
        className="h-5 w-5 text-amber-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

const recentDocs = [
  { name: 'Machine Learning Basics.pdf', time: 'Uploaded 2 hours ago', type: 'pdf' },
  { name: 'Deep Learning Notes.docx', time: 'Uploaded Yesterday', type: 'docx' },
  { name: 'System Design Architecture.pdf', time: 'Uploaded 3 days ago', type: 'pdf' },
  { name: 'Quantum Computing Intro.txt', time: 'Uploaded 5 days ago', type: 'txt' },
];

const getFileIcon = (type: string) => {
  if (type === 'pdf') {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </div>
    );
  }
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-[#0D5B5A] border border-teal-100">
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    </div>
  );
};

const DashboardPage = () => {
  return (
    <div className="space-y-8">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Hello, Rishabh! 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here&apos;s what&apos;s happening with your learning today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Current Date Badge */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm">
            <svg
              className="h-4 w-4 text-slate-400"
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
            <span>11 May, 2025</span>
          </div>

          {/* Upload Button */}
          <Link
            to="/documents/upload"
            className="flex items-center gap-2 rounded-xl bg-[#0D5B5A] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-[0_4px_16px_rgba(13,91,90,0.35)] transition duration-200 hover:bg-[#0A4A49] active:scale-[0.98]"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>+ Upload</span>
          </Link>
        </div>
      </div>

      {/* 4 Statistics Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
        {stats.map((item) => (
          <div
            key={item.title}
            className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-teal-400 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {item.title}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 group-hover:scale-105 transition">
                {item.icon}
              </div>
            </div>

            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {item.value}
              </div>
              <p className="mt-1 flex items-center text-xs font-semibold text-[#0D5B5A]">
                {item.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main 2-Column Content Area */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Recent Documents (2 spans) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <h2 className="text-base font-bold text-slate-900">Recent Documents</h2>
            <Link
              to="/documents"
              className="text-xs font-semibold text-[#0D5B5A] hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentDocs.map((doc) => (
              <div
                key={doc.name}
                className="flex items-center justify-between py-3.5 transition hover:bg-slate-50/60 rounded-xl px-2 -mx-2"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {getFileIcon(doc.type)}
                  <div className="truncate">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">{doc.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/chat"
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-[#0D5B5A] hover:text-[#0D5B5A] transition"
                  >
                    <span>Ask AI</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: AI Summary & Learning Progress */}
        <div className="space-y-6">
          {/* AI Summary Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3.5">
              <div className="flex items-center gap-2">
                <span className="text-base">✨</span>
                <h3 className="text-sm font-bold text-slate-900">AI Summary</h3>
              </div>
              <span className="text-xs font-semibold text-[#0D5B5A] cursor-pointer hover:underline">
                View All
              </span>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
              You have been focusing on{' '}
              <strong className="text-slate-900 font-semibold">Machine Learning</strong>{' '}
              and{' '}
              <strong className="text-slate-900 font-semibold">Data Structures</strong>.
              Keep going! You are on a great learning streak.
            </p>
          </div>

          {/* Learning Progress Gauge */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col items-center justify-center text-center">
            {/* Circular Gauge matching reference */}
            <div className="relative flex h-36 w-36 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                {/* Background track */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-slate-100"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Progress track */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-[#0D5B5A]"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset="62.8" /* 75% progress */
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-slate-900">75%</span>
              </div>
            </div>

            <p className="mt-3 text-sm font-bold text-slate-800">Learning Progress</p>
            <p className="text-xs text-slate-400 mt-0.5">
              3 of 4 Weekly goals completed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
