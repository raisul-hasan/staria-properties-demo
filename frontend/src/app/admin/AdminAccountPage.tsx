import { useEffect, useState } from "react";
import { KeyRound, Laptop, Loader2, LogOut, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router";
import { api, type AdminSession } from "../services/api";
import { useAdminAuth } from "./AdminAuth";

export default function AdminAccountPage() {
  const { user, signOut } = useAdminAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<AdminSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [changing, setChanging] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const loadSessions = async () => {
    setLoading(true);
    try {
      setSessions(await api.listSessions());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Sessions could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setNotice(null);
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    setChanging(true);
    try {
      await api.changePassword(passwords.currentPassword, passwords.newPassword, passwords.confirmPassword);
      await signOut();
      navigate("/admin/login?passwordChanged=1", { replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Password could not be changed.");
    } finally {
      setChanging(false);
    }
  };

  const revoke = async (id: string) => {
    setRevoking(id);
    setError(null);
    try {
      await api.revokeSession(id);
      setSessions((current) => current.filter((session) => session.id !== id));
      setNotice("Session signed out successfully.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Session could not be revoked.");
    } finally {
      setRevoking(null);
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[.24em] font-semibold text-[#0B5E3C] mb-2">Security</p>
        <h1 className="text-3xl md:text-4xl text-[#1B1B1B]" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>Account and sessions</h1>
        <p className="text-[#666] mt-2">Manage your password and devices signed in to {user?.email}.</p>
      </div>

      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-4 mb-5">{error}</div>}
      {notice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 p-4 mb-5">{notice}</div>}

      <div className="grid lg:grid-cols-2 gap-5">
        <section className="bg-white rounded-2xl border border-black/7 p-5 md:p-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-10 rounded-xl bg-[#0B5E3C]/10 text-[#0B5E3C] flex items-center justify-center"><KeyRound size={19} /></span>
            <div><h2 className="font-semibold text-lg">Change password</h2><p className="text-xs text-[#777]">All sessions will be signed out.</p></div>
          </div>
          <form onSubmit={changePassword} className="space-y-4">
            {[
              ["currentPassword", "Current password", "current-password"],
              ["newPassword", "New password", "new-password"],
              ["confirmPassword", "Confirm new password", "new-password"]
            ].map(([key, label, autoComplete]) => (
              <label key={key} className="block">
                <span className="block text-sm font-semibold mb-2">{label}</span>
                <input
                  type="password"
                  required
                  minLength={10}
                  autoComplete={autoComplete}
                  value={passwords[key as keyof typeof passwords]}
                  onChange={(event) => setPasswords((current) => ({ ...current, [key]: event.target.value }))}
                  className="w-full rounded-xl border border-black/10 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-[#0B5E3C]/10 focus:border-[#0B5E3C]"
                />
              </label>
            ))}
            <p className="text-xs text-[#777]">Use 10+ characters with uppercase, lowercase, a number, and a special character.</p>
            <button disabled={changing} className="w-full rounded-xl bg-[#0B5E3C] text-white py-3 font-semibold inline-flex justify-center items-center gap-2 disabled:opacity-60">
              {changing ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={17} />} Change password
            </button>
          </form>
        </section>

        <section className="bg-white rounded-2xl border border-black/7 p-5 md:p-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-10 rounded-xl bg-[#D9A11A]/12 text-[#9A6D00] flex items-center justify-center"><Laptop size={19} /></span>
            <div><h2 className="font-semibold text-lg">Active sessions</h2><p className="text-xs text-[#777]">Sign out devices you do not recognize.</p></div>
          </div>
          {loading ? (
            <div className="py-12 text-center text-[#666]"><Loader2 className="animate-spin inline mr-2" size={17} />Loading sessions…</div>
          ) : sessions.length === 0 ? (
            <p className="py-12 text-center text-[#777]">No active sessions found.</p>
          ) : (
            <ul className="space-y-3">
              {sessions.map((session) => (
                <li key={session.id} className="rounded-xl border border-black/8 p-4">
                  <p className="font-semibold text-sm truncate">{friendlyDevice(session.userAgent)}</p>
                  <p className="text-xs text-[#777] mt-1">{session.ipAddress || "IP unavailable"} · signed in {formatDate(session.createdAt)}</p>
                  <p className="text-xs text-[#999] mt-1">Expires {formatDate(session.expiresAt)}</p>
                  <button
                    type="button"
                    disabled={revoking === session.id}
                    onClick={() => revoke(session.id)}
                    className="mt-3 text-sm font-semibold text-red-600 inline-flex items-center gap-2 disabled:opacity-50"
                  >
                    {revoking === session.id ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />} Sign out session
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function friendlyDevice(userAgent?: string | null) {
  if (!userAgent) return "Unknown device";
  const browser = /Edg\//.test(userAgent) ? "Edge" : /Chrome\//.test(userAgent) ? "Chrome" : /Firefox\//.test(userAgent) ? "Firefox" : /Safari\//.test(userAgent) ? "Safari" : "Browser";
  const os = /Windows/.test(userAgent) ? "Windows" : /Mac OS/.test(userAgent) ? "macOS" : /Android/.test(userAgent) ? "Android" : /iPhone|iPad/.test(userAgent) ? "iOS" : "device";
  return `${browser} on ${os}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}
