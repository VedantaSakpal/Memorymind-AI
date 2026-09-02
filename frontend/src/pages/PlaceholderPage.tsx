import { Link } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: string;
}

const PlaceholderPage = ({ title, description, icon }: PlaceholderPageProps) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      {/* Content Container */}
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-12 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-teal-50 text-3xl shadow-inner border border-teal-100 mb-4">
          {icon}
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">{title} Workspace</h2>
        <p className="mt-2 max-w-md text-xs sm:text-sm text-slate-500 leading-relaxed">
          This module is part of your MemoryMind AI suite and is fully configured to
          analyze and index your learning flow.
        </p>

        <div className="mt-6 flex items-center gap-3">
          <Link
            to="/dashboard"
            className="rounded-xl bg-[#0D5B5A] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-[#0A4A49] transition"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/documents/upload"
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Upload Documents
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
