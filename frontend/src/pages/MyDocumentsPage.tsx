import { useState } from 'react';
import { Link } from 'react-router-dom';

interface DocumentItem {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'pptx' | 'txt';
  size: string;
  uploadedAt: string;
}

const folders = [
  { name: 'ML Notes', filesCount: '30 files', color: 'bg-amber-100/70 text-amber-700' },
  {
    name: 'Sem 6 Notes',
    filesCount: '18 files',
    color: 'bg-indigo-100/70 text-indigo-700',
  },
  {
    name: 'Research Papers',
    filesCount: '24 files',
    color: 'bg-teal-100/70 text-[#0D5B5A]',
  },
  {
    name: 'Personal',
    filesCount: '10 files',
    color: 'bg-emerald-100/70 text-emerald-700',
  },
];

const documents: DocumentItem[] = [
  {
    id: '1',
    name: 'Machine Learning Basics.pdf',
    type: 'pdf',
    size: '5.4 MB',
    uploadedAt: '11 May 2025',
  },
  {
    id: '2',
    name: 'Deep Learning Notes.pdf',
    type: 'pdf',
    size: '7.8 MB',
    uploadedAt: '10 May 2025',
  },
  {
    id: '3',
    name: 'Operating Systems.pdf',
    type: 'pdf',
    size: '3.2 MB',
    uploadedAt: '10 May 2025',
  },
  {
    id: '4',
    name: 'Data Structures.docx',
    type: 'docx',
    size: '2.1 MB',
    uploadedAt: '08 May 2025',
  },
  {
    id: '5',
    name: 'Computer Networks.pdf',
    type: 'pdf',
    size: '4.6 MB',
    uploadedAt: '08 May 2025',
  },
];

const MyDocumentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getDocIcon = (type: string) => {
    if (type === 'pdf') {
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex-shrink-0">
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
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex-shrink-0">
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            My Documents
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            All your uploaded documents in one place.
          </p>
        </div>

        <Link
          to="/documents/upload"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0D5B5A] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(13,91,90,0.35)] transition duration-200 hover:bg-[#0A4A49] active:scale-[0.98]"
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
          <span>Upload File</span>
        </Link>
      </div>

      {/* Top Filter Controls Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 shadow-sm transition focus:border-[#0D5B5A] focus:outline-none focus:ring-2 focus:ring-[#0D5B5A]/20"
          />
        </div>

        {/* Dropdowns & View Mode Toggles */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm focus:border-[#0D5B5A] focus:outline-none"
          >
            <option>All Types</option>
            <option>PDF Documents</option>
            <option>Word Documents</option>
            <option>Presentations</option>
          </select>

          <select className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm focus:border-[#0D5B5A] focus:outline-none">
            <option>Recently Added</option>
            <option>Alphabetical</option>
            <option>File Size</option>
          </select>

          {/* Grid / List view toggle */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`rounded-lg p-1.5 transition ${
                viewMode === 'list'
                  ? 'bg-teal-50 text-[#0D5B5A]'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              aria-label="List View"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`rounded-lg p-1.5 transition ${
                viewMode === 'grid'
                  ? 'bg-teal-50 text-[#0D5B5A]'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              aria-label="Grid View"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Folders Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 sm:gap-4">
        {folders.map((folder) => (
          <div
            key={folder.name}
            className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm transition hover:border-[#0D5B5A]/30 hover:shadow-md cursor-pointer group"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${folder.color} group-hover:scale-105 transition`}
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate group-hover:text-[#0D5B5A] transition">
                {folder.name}
              </p>
              <p className="text-[11px] text-slate-400 font-medium">
                {folder.filesCount}
              </p>
            </div>
          </div>
        ))}

        {/* Dotted + New Folder button */}
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-3.5 text-xs font-semibold text-slate-600 transition hover:border-[#0D5B5A] hover:text-[#0D5B5A] hover:bg-teal-50/30"
        >
          <span className="text-base font-bold">+</span>
          <span>New Folder</span>
        </button>
      </div>

      {/* Documents View: Table or Grid */}
      {viewMode === 'list' ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Name</th>
                  <th className="py-3.5 px-6">Size</th>
                  <th className="py-3.5 px-6">Uploaded At</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="transition hover:bg-slate-50/70 group">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        {getDocIcon(doc.type)}
                        <span className="font-semibold text-slate-900 group-hover:text-[#0D5B5A] transition cursor-pointer">
                          {doc.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 text-xs font-medium">
                      {doc.size}
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 text-xs font-medium">
                      {doc.uploadedAt}
                    </td>
                    <td className="py-3.5 px-6 text-right relative">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenuId(openMenuId === doc.id ? null : doc.id)
                        }
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Actions"
                      >
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="12" cy="5" r="1" />
                          <circle cx="12" cy="19" r="1" />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === doc.id && (
                        <div className="absolute right-6 top-10 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-50 text-left text-xs font-medium text-slate-700">
                          <Link
                            to="/chat"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-teal-50 hover:text-[#0D5B5A]"
                          >
                            <span>💬</span> Ask in AI Chat
                          </Link>
                          <Link
                            to="/flashcards"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-teal-50 hover:text-[#0D5B5A]"
                          >
                            <span>🗂️</span> Create Flashcards
                          </Link>
                          <Link
                            to="/quizzes"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-teal-50 hover:text-[#0D5B5A]"
                          >
                            <span>📝</span> Generate Quiz
                          </Link>
                          <div className="border-t border-slate-100 my-1" />
                          <button
                            type="button"
                            className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50"
                          >
                            <span>🗑️</span> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-[#0D5B5A]/40 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                {getDocIcon(doc.type)}
                <span className="text-xs text-slate-400 font-medium">{doc.size}</span>
              </div>
              <h4 className="mt-3 text-sm font-bold text-slate-900 truncate">
                {doc.name}
              </h4>
              <p className="mt-1 text-xs text-slate-400">Uploaded {doc.uploadedAt}</p>
              <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                <Link
                  to="/chat"
                  className="flex-1 rounded-xl bg-teal-50 py-1.5 text-center text-xs font-semibold text-[#0D5B5A] hover:bg-[#0D5B5A] hover:text-white transition"
                >
                  Ask AI
                </Link>
                <Link
                  to="/quizzes"
                  className="flex-1 rounded-xl border border-slate-200 py-1.5 text-center text-xs font-semibold text-slate-700 hover:border-teal-300 transition"
                >
                  Quiz
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDocumentsPage;
