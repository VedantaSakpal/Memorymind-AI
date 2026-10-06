import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Logo from '@/ui/Logo';
import { authApi } from '@/api/auth';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>(
    token ? 'verifying' : 'error'
  );
  const [message, setMessage] = useState(
    token ? 'Verifying your email...' : 'No verification token provided.'
  );

  // Resend form state
  const [resendEmail, setResendEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const [resendError, setResendError] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token in URL.');
      return;
    }

    let isMounted = true;
    authApi
      .verifyEmail(token)
      .then((res) => {
        if (isMounted) {
          setStatus('success');
          setMessage(res.message || 'Email verified successfully! You can now log in.');
        }
      })
      .catch((err) => {
        if (isMounted) {
          setStatus('error');
          const detail =
            err.response?.data?.detail || 'Verification failed. The token may be expired or invalid.';
          setMessage(detail);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail.trim()) return;

    setIsResending(true);
    setResendMsg('');
    setResendError('');

    try {
      const res = await authApi.resendVerification(resendEmail);
      setResendMsg(res.message);
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Failed to resend verification email. Please try again later.';
      setResendError(detail);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#111111] p-6 text-white relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-teal-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-cyan-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#666666_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />

      {/* Brand logo */}
      <Link to="/" className="mb-8 flex items-center gap-3 group relative z-10">
        <Logo />
        <span className="text-xl font-bold tracking-tight text-white transition group-hover:text-teal-300">
          MemoryMind AI
        </span>
      </Link>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-teal-500/30 bg-slate-900/80 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.37)] backdrop-blur-xl text-center">
        {status === 'verifying' && (
          <div className="flex flex-col items-center py-6">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-teal-500/40 bg-teal-500/10 text-teal-400">
              <span className="h-8 w-8 animate-spin rounded-full border-3 border-teal-400 border-t-transparent" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verifying Email</h2>
            <p className="text-sm text-slate-300">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center py-6">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-3xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verified!</h2>
            <p className="text-sm text-slate-300 mb-6">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full rounded-xl bg-[#000000] py-3 text-sm font-semibold text-white shadow-[0_4px_18px_rgba(0,0,0,0.35)] transition duration-200 hover:bg-[#000000] hover:shadow-[0_6px_22px_rgba(0,0,0,0.45)] active:scale-[0.99]"
            >
              Continue to Login
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center py-4 text-left">
            <div className="self-center mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-500/40 bg-rose-500/10 text-rose-400 text-3xl">
              ✕
            </div>
            <h2 className="self-center text-2xl font-bold text-white mb-2 text-center">
              Verification Failed
            </h2>
            <p className="self-center text-sm text-slate-300 mb-6 text-center">{message}</p>

            {/* Resend Section */}
            <div className="w-full rounded-xl border border-slate-800 bg-slate-950/60 p-5 mt-2">
              <h3 className="text-sm font-semibold text-teal-300 mb-1">
                Resend Verification Link
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Enter your email address to receive a fresh verification link.
              </p>

              {resendMsg && (
                <div className="mb-3 rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-2.5 text-xs text-emerald-300">
                  {resendMsg}
                </div>
              )}
              {resendError && (
                <div className="mb-3 rounded-lg border border-rose-500/30 bg-rose-950/40 p-2.5 text-xs text-rose-300">
                  {resendError}
                </div>
              )}

              <form onSubmit={handleResend} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
                />
                <button
                  type="submit"
                  disabled={isResending}
                  className="w-full rounded-lg bg-teal-600 py-2.5 text-xs font-semibold text-white shadow hover:bg-teal-500 disabled:opacity-50 transition"
                >
                  {isResending ? 'Sending...' : 'Send New Verification Link'}
                </button>
              </form>
            </div>

            <div className="mt-6 self-center">
              <Link to="/login" className="text-xs text-teal-400 hover:underline">
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
