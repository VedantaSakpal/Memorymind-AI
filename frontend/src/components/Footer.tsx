const links = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#workflow' },
  { label: 'Technology', href: '#technology' },
  { label: 'Future Scope', href: '#learning' },
];

const Footer = () => (
  <footer className="border-t border-slate-200/90 bg-white/95 py-10 text-slate-600">
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2 text-center lg:text-left">
        <p className="text-2xl font-extrabold text-[#0C162C]">MemoryMind AI</p>
        <p className="max-w-md text-sm text-slate-500">
          Remember Everything. Forget Nothing.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-600">
        {links.map((link) => (
          <a key={link.label} href={link.href} className="transition hover:text-[#0D5B5A]">
            {link.label}
          </a>
        ))}
      </div>
    </div>
    <div className="mt-8 border-t border-slate-100 pt-6 text-center text-sm text-slate-400">
      © 2026 MemoryMind AI • All rights reserved.
    </div>
  </footer>
);

export default Footer;
