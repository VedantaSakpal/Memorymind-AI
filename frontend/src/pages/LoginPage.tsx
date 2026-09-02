import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/ui/Logo';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('rishabhmahadik@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans antialiased text-slate-900">
      {/* LEFT COLUMN: Dark Navy / Futuristic Hero */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#0C192E] p-12 text-white lg:flex xl:p-16">
        {/* Background ambient glows & particle constellation */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-teal-500/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-cyan-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />

        {/* Top brand */}
        <Link to="/" className="relative z-10 flex items-center gap-3 group">
          <Logo />
          <span className="text-xl font-bold tracking-tight text-white transition group-hover:text-teal-300">
            MemoryMind AI
          </span>
        </Link>

        {/* Center content & 3D Illustration */}
        <div className="relative z-10 my-auto flex flex-col items-center text-center">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-white xl:text-4xl">
              Welcome Back!
            </h1>
            <p className="mt-2 text-base text-slate-300">
              Login to continue your journey of learning.
            </p>
          </div>

          {/* Futuristic AI Student / Hologram Visual */}
          <div className="relative flex h-[320px] w-full max-w-[380px] items-center justify-center">
            {/* Holographic glowing base */}
            <div className="absolute bottom-4 h-24 w-64 rounded-full bg-teal-500/30 blur-2xl animate-pulse" />
            <div className="absolute bottom-8 h-12 w-48 rounded-full border border-teal-400/40 bg-teal-500/10" />

            {/* Glowing avatar visual frame */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative flex h-36 w-36 items-center justify-center rounded-3xl border border-teal-500/40 bg-gradient-to-tr from-teal-950/70 to-slate-900/70 p-4 shadow-[0_0_40px_rgba(20,184,166,0.3)] backdrop-blur-xl">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0D5B5A] to-[#14B8A6] text-4xl shadow-inner">
                  👨‍💻
                </div>
                {/* Floating nodes around avatar */}
                <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full border border-teal-400/50 bg-[#0C192E] text-sm shadow-md animate-bounce">
                  ⚡
                </div>
                <div className="absolute -bottom-2 -left-3 flex h-8 w-8 items-center justify-center rounded-full border border-teal-400/50 bg-[#0C192E] text-sm shadow-md">
                  🧠
                </div>
              </div>

              {/* Floating Hologram Data stream pills */}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <span className="rounded-full border border-teal-500/30 bg-teal-950/60 px-3 py-1 text-xs text-teal-200 backdrop-blur-md">
                  ● 128 Documents Synced
                </span>
                <span className="rounded-full border border-cyan-500/30 bg-cyan-950/60 px-3 py-1 text-xs text-cyan-200 backdrop-blur-md">
                  ✦ Neural Graph Ready
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400">
          <span>© 2026 MemoryMind AI</span>
          <span>Privacy & Terms</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Clean White Form Panel */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <Logo />
            <span className="text-xl font-bold tracking-tight text-slate-900">
              MemoryMind AI
            </span>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Login to your account
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Welcome back! Please enter your details.
            </p>
          </div>

          {/* Social Logins */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300"
            >
              {/* Google G icon */}
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continue with Google
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300"
            >
              {/* GitHub icon */}
              <svg className="h-5 w-5 fill-slate-800" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-xs uppercase text-slate-400 font-medium">
              or
            </span>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-[#0D5B5A] focus:outline-none focus:ring-2 focus:ring-[#0D5B5A]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 transition focus:border-[#0D5B5A] focus:outline-none focus:ring-2 focus:ring-[#0D5B5A]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#0D5B5A] focus:ring-[#0D5B5A]"
                />
                Remember me
              </label>
              <a
                href="#forgot"
                className="text-xs font-semibold text-[#0D5B5A] hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-[#0D5B5A] py-3 text-sm font-semibold text-white shadow-[0_4px_18px_rgba(13,91,90,0.35)] transition duration-200 hover:bg-[#0A4A49] hover:shadow-[0_6px_22px_rgba(13,91,90,0.45)] active:scale-[0.99]"
            >
              Login
            </button>
          </form>

          {/* Footer Register prompt */}
          <div className="mt-8 text-center text-xs text-slate-500">
            Don&apos;t have an account?{' '}
            <Link to="/login" className="font-bold text-[#0D5B5A] hover:underline">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
