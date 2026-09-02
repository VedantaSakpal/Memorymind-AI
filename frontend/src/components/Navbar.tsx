import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/ui/Logo';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#workflow' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-50 w-full bg-transparent">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6 sm:px-10 lg:px-12">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <Logo />
          <span className="text-xl font-extrabold tracking-tight text-[#0C162C] transition group-hover:text-[#0D5B5A]">
            MemoryMind AI
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-10 text-[15px] font-medium text-slate-600 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition duration-200 hover:text-[#0C162C] hover:font-semibold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA Buttons */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            to="/login"
            className="rounded-full border border-slate-300 bg-white px-7 py-2 text-sm font-semibold text-[#0C162C] shadow-sm transition duration-200 hover:border-slate-400 hover:bg-slate-50/90 active:scale-95"
          >
            Login
          </Link>
          <Link
            to="/dashboard"
            className="rounded-full bg-[#0D5B5A] px-7 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(13,91,90,0.35)] transition duration-200 hover:bg-[#0A4A49] hover:shadow-[0_6px_20px_rgba(13,91,90,0.45)] hover:scale-[1.02] active:scale-95"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#0C162C] shadow-sm transition hover:bg-slate-50 md:hidden"
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          <span className="text-xl">{open ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {open ? (
        <div className="border-b border-slate-200 bg-white/95 px-6 py-6 shadow-xl backdrop-blur-2xl md:hidden">
          <div className="flex flex-col gap-4 text-center">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-xl py-2.5 text-base font-medium text-slate-700 hover:bg-slate-100 hover:text-[#0C162C]"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-3 pt-3 border-t border-slate-200">
              <Link
                to="/login"
                className="rounded-full border border-slate-300 bg-white py-2.5 text-sm font-semibold text-[#0C162C] text-center"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/dashboard"
                className="rounded-full bg-[#0D5B5A] py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(13,91,90,0.35)] text-center"
                onClick={() => setOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
