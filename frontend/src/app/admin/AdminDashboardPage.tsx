import { useEffect, useState } from "react";
import { ArrowRight, Building2, CheckCircle2, FileQuestion, FolderKanban, Mail, Newspaper, RefreshCw, Users } from "lucide-react";
import { Link } from "react-router";
import { api } from "../services/api";
import { useAdminAuth } from "./AdminAuth";

type DashboardMetric = { label: string; value: number; path: string; icon: typeof Building2; color: string };

export default function AdminDashboardPage() {
  const { user, can } = useAdminAuth();
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const definitions = [
      { label: "Properties", resource: "properties", permission: "properties:read", path: "/admin/content/properties", icon: Building2, color: "#0B5E3C" },
      { label: "Projects", resource: "projects", permission: "projects:read", path: "/admin/content/projects", icon: FolderKanban, color: "#7A5600" },
      { label: "News", resource: "news", permission: "blog:read", path: "/admin/content/news", icon: Newspaper, color: "#2A5AA5" },
      { label: "FAQs", resource: "faqs", permission: "content:read", path: "/admin/content/faqs", icon: FileQuestion, color: "#8B5CF6" },
      { label: "Testimonials", resource: "testimonials", permission: "testimonials:read", path: "/admin/content/testimonials", icon: Users, color: "#C2410C" }
    ].filter((item) => can(item.permission));
    try {
      const result = await Promise.all(definitions.map(async (item) => ({ ...item, value: (await api.listCms(item.resource, { limit: 1 })).meta.total })));
      if (can("inquiries:read")) {
        const enquiries = await api.listContactSubmissions({ limit: 1 });
        result.push({ label: "Enquiries", resource: "enquiries", permission: "inquiries:read", path: "/admin/enquiries", icon: Mail, color: "#BE123C", value: enquiries.meta.total });
      }
      setMetrics(result);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Dashboard data could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-9">
        <div>
          <p className="text-xs uppercase tracking-[.24em] font-semibold text-[#0B5E3C] mb-2">Overview</p>
          <h1 className="text-4xl text-[#1B1B1B] mb-2" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>Good to see you, {user?.name.split(" ")[0]}.</h1>
          <p className="text-[#666]">This dashboard is connected to the live demo database.</p>
        </div>
        <button onClick={load} disabled={loading} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-black/8 text-sm font-semibold hover:border-[#0B5E3C]/40 disabled:opacity-50"><RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh</button>
      </div>

      <div className="rounded-2xl bg-[#EAF4EE] border border-[#0B5E3C]/12 px-5 py-4 flex items-start gap-3 mb-8">
        <CheckCircle2 size={19} className="text-[#0B5E3C] mt-0.5 shrink-0" />
        <div><p className="font-semibold text-[#174C35] text-sm">Stakeholder demo mode</p><p className="text-[#3D6554] text-sm mt-1">Content marked as demo can be replaced safely before the production launch.</p></div>
      </div>

      {error && <div role="alert" className="rounded-xl bg-red-50 border border-red-200 text-red-700 p-4 mb-6">{error}</div>}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {(loading ? Array.from({ length: 6 }) : metrics).map((metric, index) =>
          loading ? (
            <div key={index} className="h-40 rounded-2xl bg-white animate-pulse" />
          ) : (
            <Link key={metric.label} to={metric.path} className="group bg-white rounded-2xl border border-black/6 p-6 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 transition-all">
              <div className="flex items-start justify-between mb-7">
                <span className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${metric.color}14`, color: metric.color }}><metric.icon size={21} /></span>
                <ArrowRight size={17} className="text-[#999] group-hover:text-[#0B5E3C] group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-3xl font-semibold text-[#1B1B1B]">{metric.value}</p>
              <p className="text-sm text-[#666] mt-1">{metric.label}</p>
            </Link>
          )
        )}
      </div>
    </div>
  );
}
