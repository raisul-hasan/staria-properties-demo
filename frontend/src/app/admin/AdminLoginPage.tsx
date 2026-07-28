import { useEffect, useState } from "react";
import { ArrowLeft, Eye, EyeOff, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router";
import { api } from "../services/api";
import { StariaLogo } from "../components/shared/StariaLogo";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.me()
      .then(() => setAuthenticated(true))
      .catch(() => setAuthenticated(false))
      .finally(() => setChecking(false));
  }, []);

  if (!checking && authenticated) return <Navigate to="/admin" replace />;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.login(email, password);
      const destination = (location.state as { from?: string } | null)?.from ?? "/admin";
      navigate(destination, { replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Sign in failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-[1.05fr_0.95fr] bg-[#F7F7F5]">
      <section className="hidden lg:flex relative overflow-hidden bg-[#082D1C] p-14 xl:p-20 text-white flex-col justify-between">
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px)", backgroundSize: "54px 54px" }} />
        <div className="relative"><StariaLogo light /></div>
        <div className="relative max-w-xl">
          <span className="inline-flex items-center gap-2 text-[#D9A11A] text-xs tracking-[.28em] uppercase font-semibold mb-6"><ShieldCheck size={16} /> Secure administration</span>
          <h1 className="text-5xl xl:text-6xl leading-[1.08] mb-6" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>Manage the demo with confidence.</h1>
          <p className="text-white/55 leading-8 max-w-lg">Review properties, projects, enquiries, publishing status and website content from one protected workspace.</p>
        </div>
        <p className="relative text-white/30 text-sm">Use only the account issued to you. Administrative activity is audited.</p>
      </section>

      <section className="flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#555] hover:text-[#0B5E3C] mb-12"><ArrowLeft size={15} /> Back to website</Link>
          <div className="lg:hidden mb-10"><StariaLogo /></div>
          <p className="text-[#0B5E3C] uppercase tracking-[.28em] text-xs font-bold mb-3">Admin portal</p>
          <h2 className="text-4xl text-[#1B1B1B] mb-3" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>Welcome back</h2>
          <p className="text-[#666] mb-9">Sign in with the owner or reviewer credentials created during database seeding.</p>

          <form onSubmit={submit} className="space-y-5">
            {(searchParams.get("reset") === "1" || searchParams.get("passwordChanged") === "1") && (
              <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                Password updated successfully. Sign in with your new password.
              </div>
            )}
            {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            <label className="block">
              <span className="block text-sm font-semibold text-[#333] mb-2">Email address</span>
              <input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 outline-none focus:border-[#0B5E3C] focus:ring-4 focus:ring-[#0B5E3C]/10" placeholder="reviewer@staria.demo" />
            </label>
            <label className="block">
              <span className="block text-sm font-semibold text-[#333] mb-2">Password</span>
              <span className="relative block">
                <LockKeyhole size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777]" />
                <input type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-black/10 bg-white pl-11 pr-12 py-3.5 outline-none focus:border-[#0B5E3C] focus:ring-4 focus:ring-[#0B5E3C]/10" placeholder="Your secure password" />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#666]" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
              </span>
            </label>
            <button disabled={submitting || checking} className="w-full rounded-xl bg-[#0B5E3C] text-white py-3.5 font-semibold hover:bg-[#094d32] disabled:opacity-60 flex items-center justify-center gap-2">
              {submitting && <Loader2 size={17} className="animate-spin" />} Sign in securely
            </button>
            <div className="text-center">
              <Link to="/admin/forgot-password" className="text-sm font-semibold text-[#0B5E3C] hover:underline">Forgot your password?</Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
