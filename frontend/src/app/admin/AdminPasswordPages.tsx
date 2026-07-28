import { useState } from "react";
import { ArrowLeft, CheckCircle2, KeyRound, Loader2, Mail } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { StariaLogo } from "../components/shared/StariaLogo";
import { api } from "../services/api";

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#F5F6F3] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-7"><StariaLogo /></div>
        <div className="bg-white rounded-3xl border border-black/7 shadow-xl shadow-black/5 p-6 md:p-8">{children}</div>
      </div>
    </main>
  );
}

export function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.forgotPassword(email);
      setSent(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Request could not be sent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      {sent ? (
        <div className="text-center">
          <CheckCircle2 size={44} className="mx-auto text-[#0B5E3C] mb-4" />
          <h1 className="text-3xl" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>Check your email</h1>
          <p className="text-[#666] mt-3">If an active admin account exists for that email, a time-limited reset link has been sent.</p>
          <Link to="/admin/login" className="mt-6 inline-flex items-center gap-2 font-semibold text-[#0B5E3C]"><ArrowLeft size={15} /> Back to sign in</Link>
        </div>
      ) : (
        <>
          <Mail size={34} className="text-[#0B5E3C] mb-4" />
          <h1 className="text-3xl" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>Reset your password</h1>
          <p className="text-[#666] mt-2 mb-6">Enter your admin email and we’ll send a secure reset link.</p>
          {error && <div role="alert" className="rounded-xl bg-red-50 border border-red-200 text-red-700 p-3 mb-4">{error}</div>}
          <form onSubmit={submit}>
            <label className="block">
              <span className="block text-sm font-semibold mb-2">Admin email</span>
              <input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-black/10 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-[#0B5E3C]/10" />
            </label>
            <button disabled={loading} className="w-full mt-5 rounded-xl bg-[#0B5E3C] text-white py-3 font-semibold inline-flex justify-center items-center gap-2 disabled:opacity-60">
              {loading && <Loader2 size={16} className="animate-spin" />} Send reset link
            </button>
          </form>
          <Link to="/admin/login" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0B5E3C]"><ArrowLeft size={14} /> Back to sign in</Link>
        </>
      )}
    </AuthShell>
  );
}

export function AdminResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!token) return setError("This reset link is missing its security token.");
    if (password !== confirmPassword) return setError("Password and confirmation do not match.");
    setLoading(true);
    try {
      await api.resetPassword(token, password);
      navigate("/admin/login?reset=1", { replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Password could not be reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <KeyRound size={34} className="text-[#0B5E3C] mb-4" />
      <h1 className="text-3xl" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>Choose a new password</h1>
      <p className="text-[#666] mt-2 mb-6">Use 10+ characters with uppercase, lowercase, a number, and a special character.</p>
      {error && <div role="alert" className="rounded-xl bg-red-50 border border-red-200 text-red-700 p-3 mb-4">{error}</div>}
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="block text-sm font-semibold mb-2">New password</span>
          <input type="password" autoComplete="new-password" required minLength={10} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-black/10 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-[#0B5E3C]/10" />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold mb-2">Confirm password</span>
          <input type="password" autoComplete="new-password" required minLength={10} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full rounded-xl border border-black/10 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-[#0B5E3C]/10" />
        </label>
        <button disabled={loading || !token} className="w-full rounded-xl bg-[#0B5E3C] text-white py-3 font-semibold inline-flex justify-center items-center gap-2 disabled:opacity-60">
          {loading && <Loader2 size={16} className="animate-spin" />} Reset password
        </button>
      </form>
    </AuthShell>
  );
}
