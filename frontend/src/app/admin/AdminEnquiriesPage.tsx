import { useEffect, useState } from "react";
import { Loader2, Mail, Phone, RefreshCw } from "lucide-react";
import { api, type ContactSubmission } from "../services/api";

export default function AdminEnquiriesPage() {
  const [items, setItems] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const response = await api.listContactSubmissions({ limit: 100 });
      setItems(response.items);
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Enquiries could not be loaded.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  return <div>
    <div className="flex items-end justify-between gap-4 mb-8"><div><p className="text-xs uppercase tracking-[.24em] font-semibold text-[#0B5E3C] mb-2">Leads</p><h1 className="text-4xl text-[#1B1B1B]" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>Customer enquiries</h1></div><button onClick={load} className="px-4 py-2.5 rounded-xl bg-white border border-black/10 inline-flex items-center gap-2 text-sm font-semibold"><RefreshCw size={15} /> Refresh</button></div>
    {error && <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-4 mb-5">{error}</div>}
    {loading ? <div className="py-20 text-center text-[#666]"><Loader2 size={20} className="inline animate-spin mr-2" /> Loading enquiries…</div> :
      <div className="grid xl:grid-cols-2 gap-5">{items.map((item) => <article key={item.id} className="bg-white rounded-2xl border border-black/6 p-6">
        <div className="flex justify-between gap-4 mb-4"><div><h2 className="font-semibold text-[#222]">{item.fullName}</h2><p className="text-sm text-[#777] mt-1">{item.subject || "General website enquiry"}</p></div><span className="h-fit text-xs font-semibold rounded-full bg-blue-50 text-blue-700 px-2.5 py-1">{item.status}</span></div>
        <p className="text-[#555] leading-7 text-sm mb-5">{item.message}</p>
        <div className="border-t border-black/6 pt-4 flex flex-wrap gap-4 text-sm"><a href={`mailto:${item.email}`} className="inline-flex items-center gap-2 text-[#0B5E3C]"><Mail size={14} /> {item.email}</a>{typeof item.phone === "string" && <a href={`tel:${item.phone}`} className="inline-flex items-center gap-2 text-[#555]"><Phone size={14} /> {item.phone}</a>}</div>
      </article>)}</div>}
  </div>;
}
