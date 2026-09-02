import { useState } from 'react';
import { Link } from 'react-router-dom';

interface AppTopbarProps {
  onMobileMenuToggle?: () => void;
}

const AppTopbar = ({ onMobileMenuToggle }: AppTopbarProps) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-6 backdrop-blur-md sm:px-8 lg:px-10">
      {/* Left: Mobile hamburger & Search bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 lg:hidden"
          aria-label="Toggle Sidebar"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Search Bar matching reference */}
        <div className="relative w-full max-w-md">
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
            placeholder="Search anything..."
            className="w-full rounded-xl border border-slate-200 bg-[#F8F9FC] py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition focus:border-[#0D5B5A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5B5A]/20"
          />
        </div>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            aria-label="Notifications"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute 2 top-2 right-2 h-2 w-2 rounded-full bg-[#0D5B5A] ring-2 ring-white" />
          </button>

          {/* Notifications Dropdown */}
          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                <h4 className="font-bold text-sm text-slate-800">Notifications</h4>
                <span className="text-xs text-[#0D5B5A] font-bold cursor-pointer hover:underline">
                  Mark all as read
                </span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-teal-50/70 text-slate-700">
                  <span className="text-base">📄</span>
                  <div>
                    <p className="font-semibold text-slate-900">Document Indexed</p>
                    <p className="text-slate-500">
                      Machine Learning Basics.pdf is ready for AI Chat & Flashcards.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 text-slate-700">
                  <span className="text-base">🧠</span>
                  <div>
                    <p className="font-semibold text-slate-900">Quiz Ready</p>
                    <p className="text-slate-500">
                      10 new questions generated for Deep Learning Notes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-slate-50"
          >
            <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#0D5B5A] to-[#14B8A6] font-semibold text-white shadow-sm ring-2 ring-teal-200">
              <span>RM</span>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="hidden text-left sm:block">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-slate-900">Rishabh Mahadik</p>
              </div>
              <p className="text-xs font-semibold text-[#0D5B5A]">Premium</p>
            </div>

            <svg
              className={`h-4 w-4 text-slate-400 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Profile Dropdown Menu */}
          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="font-bold text-sm text-slate-800">Rishabh Mahadik</p>
                <p className="text-xs text-slate-400">rishabhmahadik@gmail.com</p>
              </div>
              <div className="pt-1.5 space-y-0.5 text-xs text-slate-600 font-medium">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-slate-900"
                >
                  <span>📊</span> Dashboard
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-slate-900"
                >
                  <span>⚙️</span> Settings
                </Link>
                <div className="border-t border-slate-100 my-1" />
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50"
                >
                  <span>🚪</span> Log out
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppTopbar;
