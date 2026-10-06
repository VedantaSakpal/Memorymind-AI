import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/ui/Logo';
import { authApi } from '@/api/auth';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Toggle: 'login' | 'signup'
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Shared fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Signup-only fields
  const [fullName, setFullName] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  const handleResendVerification = async () => {
    if (!email) {
      setError('Please enter your email address to resend the verification link.');
      return;
    }
    setIsResending(true);
    setResendStatus('');
    try {
      const res = await authApi.resendVerification(email);
      setResendStatus(res.message);
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Failed to resend verification link. Please try again.';
      setResendStatus(detail);
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setResendStatus('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const tokens = await authApi.login({ email, password });
        await login(tokens);
        navigate('/dashboard');
      } else {
        if (!fullName.trim()) {
          setError('Please enter your full name.');
          setIsLoading(false);
          return;
        }
        await authApi.register({ email, password, full_name: fullName });
        setSuccessMsg(
          `Account created! A verification link has been sent to ${email}. Please verify your email before logging in.`
        );
        setShowResend(true);
        setMode('login');
      }
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string | Array<{ msg: string }> } } })?.response?.data?.detail;
      let msg = 'Something went wrong. Please try again.';
      if (typeof detail === 'string') {
        msg = detail;
      } else if (Array.isArray(detail) && detail.length > 0) {
        msg = detail.map((d) => d.msg).join(', ');
      }

      setError(msg);
      if (typeof msg === 'string' && msg.toLowerCase().includes('not verified')) {
        setShowResend(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans antialiased text-slate-900">
      {/* LEFT COLUMN: Dark Navy / Futuristic Hero */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#111111] p-12 text-white lg:flex xl:p-16">
        {/* Background ambient glows & particle constellation */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-teal-500/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-cyan-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#666666_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />

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
              {mode === 'login' ? 'Welcome Back!' : 'Start Learning Smarter'}
            </h1>
            <p className="mt-2 text-base text-slate-300">
              {mode === 'login'
                ? 'Login to continue your journey of learning.'
                : 'Create your account and upload your first document.'}
            </p>
          </div>

          {/* Futuristic AI visual */}
          <div className="relative flex h-[320px] w-full max-w-[380px] items-center justify-center">
            <div className="absolute bottom-4 h-24 w-64 rounded-full bg-teal-500/30 blur-2xl animate-pulse" />
            <div className="absolute bottom-8 h-12 w-48 rounded-full border border-teal-400/40 bg-teal-500/10" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="relative flex h-36 w-36 items-center justify-center rounded-3xl border border-teal-500/40 bg-gradient-to-tr from-teal-950/70 to-slate-900/70 p-4 shadow-[0_0_40px_rgba(102,102,102,0.3)] backdrop-blur-xl">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#000000] to-[#666666] text-4xl shadow-inner">
                  {mode === 'login' ? '👨‍💻' : '🚀'}
                </div>
                <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full border border-teal-400/50 bg-[#111111] text-sm shadow-md animate-bounce">
                  ⚡
                </div>
                <div className="absolute -bottom-2 -left-3 flex h-8 w-8 items-center justify-center rounded-full border border-teal-400/50 bg-[#111111] text-sm shadow-md">
                  🧠
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <span className="rounded-full border border-teal-500/30 bg-teal-950/60 px-3 py-1 text-xs text-teal-200 backdrop-blur-md">
                  ● Documents Synced
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
              {mode === 'login' ? 'Login to your account' : 'Create an account'}
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              {mode === 'login'
                ? 'Welcome back! Please enter your details.'
                : 'Start your AI-powered learning journey today.'}
            </p>
          </div>

          {/* Error / Success Banner */}
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {successMsg}
            </div>
          )}

          {/* Resend Verification Option */}
          {showResend && (
            <div className="mb-4 rounded-xl border border-teal-200 bg-teal-50/70 p-3.5 text-xs text-slate-700">
              <div className="flex items-center justify-between">
                <span>Need a verification link?</span>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="font-semibold text-[#000000] hover:underline disabled:opacity-50"
                >
                  {isResending ? 'Sending...' : 'Resend Email'}
                </button>
              </div>
              {resendStatus && (
                <p className="mt-2 text-xs font-medium text-[#000000]">{resendStatus}</p>
              )}
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (Signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-[#000000] focus:outline-none focus:ring-2 focus:ring-[#000000]/20"
                />
              </div>
            )}

            {/* Email */}
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
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-[#000000] focus:outline-none focus:ring-2 focus:ring-[#000000]/20"
              />
            </div>

            {/* Password */}
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
                  placeholder={mode === 'signup' ? 'Min. 8 characters' : 'Enter your password'}
                  minLength={mode === 'signup' ? 8 : undefined}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 transition focus:border-[#000000] focus:outline-none focus:ring-2 focus:ring-[#000000]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {mode === 'signup' && (
                <p className="mt-1 text-[11px] text-slate-500">
                  Must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character.
                </p>
              )}
            </div>

            {/* Forgot Password (login only) */}
            {mode === 'login' && (
              <div className="flex justify-end pt-1">
                <a href="#forgot" className="text-xs font-semibold text-[#000000] hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-xl bg-[#000000] py-3 text-sm font-semibold text-white shadow-[0_4px_18px_rgba(0,0,0,0.35)] transition duration-200 hover:bg-[#000000] hover:shadow-[0_6px_22px_rgba(0,0,0,0.45)] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {mode === 'login' ? 'Logging in...' : 'Creating account...'}
                </>
              ) : mode === 'login' ? (
                'Login'
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="mt-8 text-center text-xs text-slate-500">
            {mode === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => { setMode('signup'); setError(''); setSuccessMsg(''); }}
                  className="font-bold text-[#000000] hover:underline"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
                  className="font-bold text-[#000000] hover:underline"
                >
                  Log In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
