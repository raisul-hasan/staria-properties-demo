import { useEffect, useMemo, useRef, useState } from "react";
import {
  Archive,
  Check,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Send,
  Trash2,
  X
} from "lucide-react";
import { useParams } from "react-router";
import { ApiError, api, type CmsRecord, type MediaAsset } from "../services/api";
import { MediaPickerField } from "./AdminMediaLibrary";
import { getAdminResource, type FieldDefinition } from "./adminResources";
import { useAdminAuth } from "./AdminAuth";

type ReferenceOption = { id: string; label: string };

function recordName(record: CmsRecord) {
  return String(record.title ?? record.name ?? record.question ?? record.label ?? record.email ?? record.key ?? record.id);
}

function mediaAssets(value: unknown): MediaAsset[] {
  if (!value) return [];
  const values = Array.isArray(value) ? value : [value];
  return values
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const object = item as Record<string, unknown>;
      return (object.media ?? object) as MediaAsset;
    })
    .filter((item): item is MediaAsset => Boolean(item?.id && item?.secureUrl));
}

function initialFieldValue(field: FieldDefinition, source: Record<string, unknown>) {
  let value = source[field.key];
  if (value === undefined && field.relationKey) {
    const relation = source[field.relationKey];
    if (field.type === "reference" && relation && typeof relation === "object") value = (relation as Record<string, unknown>).id;
    if (field.type === "media") value = relation;
  }
  if (field.type === "media" || field.type === "media-list") return mediaAssets(value);
  if (field.type === "tags") {
    if (!Array.isArray(value)) value = source.tags;
    if (!Array.isArray(value)) return "";
    return value
      .map((item) => {
        if (typeof item === "string") return item;
        if (!item || typeof item !== "object") return "";
        const object = item as Record<string, unknown>;
        const tag = (object.blogTag ?? object.tag ?? object) as Record<string, unknown>;
        return String(tag.name ?? "");
      })
      .filter(Boolean)
      .join(", ");
  }
  if (field.type === "date" && value) return String(value).slice(0, 10);
  if (field.type === "checkbox") return Boolean(value);
  return value ?? "";
}

function parsePayloadField(field: FieldDefinition, value: unknown) {
  if (field.type === "number") return value === "" ? undefined : Number(value);
  if (field.type === "checkbox") return Boolean(value);
  if (field.type === "tags") {
    return String(value ?? "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  if (field.type === "json") {
    if (value === "" || value === null || value === undefined) return undefined;
    if (typeof value !== "string") return value;
    try {
      return JSON.parse(value);
    } catch {
      if (field.key === "value") return value;
      throw new Error("Invalid JSON");
    }
  }
  if (field.type === "reference") return value === "" ? null : value;
  if (field.type === "media") {
    const selected = value as MediaAsset[];
    return selected[0]?.id ?? null;
  }
  if (field.type === "media-list") {
    const selected = value as MediaAsset[];
    return selected.map((asset, index) => ({
      mediaId: asset.id,
      role: field.mediaRole ?? (index === 0 ? "PRIMARY" : "GALLERY"),
      sortOrder: index
    }));
  }
  if (value === "") return undefined;
  return value;
}

export default function AdminResourcePage() {
  const { resource = "properties" } = useParams();
  const definition = getAdminResource(resource);
  const { can } = useAdminAuth();
  const [items, setItems] = useState<CmsRecord[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [editing, setEditing] = useState<CmsRecord | "new" | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [references, setReferences] = useState<Record<string, ReferenceOption[]>>({});
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CmsRecord | null>(null);
  const editorTitleRef = useRef<HTMLHeadingElement>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.listCms(resource, { page, limit: 12, search });
      setItems(response.items);
      setTotalPages(Math.max(1, response.meta.totalPages));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Records could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setSearch("");
    setEditing(null);
  }, [resource]);

  useEffect(() => {
    load();
  }, [resource, page]);

  useEffect(() => {
    if (!editing) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setEditing(null);
    };
    window.addEventListener("keydown", onKeyDown);
    setTimeout(() => editorTitleRef.current?.focus(), 0);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editing]);

  const loadReferences = async () => {
    const resourceNames = [
      ...new Set(
        definition.fields
          .filter((field) => field.type === "reference" && field.referenceResource)
          .map((field) => field.referenceResource as string)
      )
    ];
    const results = await Promise.all(
      resourceNames.map(async (referenceResource) => {
        try {
          const result = await api.listCms(referenceResource, { limit: 100 });
          return [
            referenceResource,
            result.items.map((item) => ({ id: item.id, label: recordName(item) }))
          ] as const;
        } catch {
          return [referenceResource, []] as const;
        }
      })
    );
    setReferences(Object.fromEntries(results));
  };

  const openEditor = (record: CmsRecord | "new") => {
    setEditing(record);
    setError(null);
    setNotice(null);
    setFieldErrors({});
    const source = (record === "new" ? definition.createDefaults ?? {} : record) as Record<string, unknown>;
    setForm(
      Object.fromEntries(
        definition.fields.map((field) => [field.key, initialFieldValue(field, source)])
      )
    );
    loadReferences();
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setFieldErrors({});
    try {
      const entries = definition.fields.map((field) => {
        try {
          return [field.key, parsePayloadField(field, form[field.key])] as const;
        } catch {
          throw new Error(`${field.label} must contain valid JSON.`);
        }
      });
      const payload = Object.fromEntries(entries.filter(([, value]) => value !== undefined));
      if (editing === "new") await api.createCms(resource, { ...definition.createDefaults, ...payload });
      else if (editing) await api.updateCms(resource, editing.id, payload);
      setEditing(null);
      setNotice(editing === "new" ? "Record created successfully." : "Changes saved successfully.");
      await load();
    } catch (caught) {
      if (caught instanceof ApiError) {
        setFieldErrors(
          Object.fromEntries(
            caught.details.filter((detail) => detail.field).map((detail) => [detail.field as string, detail.message])
          )
        );
      }
      setError(caught instanceof Error ? caught.message : "The record could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  const transition = async (record: CmsRecord, action: "publish" | "draft") => {
    setBusyId(record.id);
    setError(null);
    try {
      await api.transitionCms(resource, record.id, action);
      setNotice(action === "publish" ? "Record published." : "Record moved out of public view.");
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : `Could not ${action} record.`);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async () => {
    if (!pendingDelete) return;
    setBusyId(pendingDelete.id);
    setError(null);
    try {
      await api.deleteCms(resource, pendingDelete.id);
      setNotice("Record archived successfully.");
      setPendingDelete(null);
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not archive record.");
    } finally {
      setBusyId(null);
    }
  };

  const canCreate = can(`${definition.permission}:create`) || can(`${definition.permission}:manage`);
  const canUpdate = can(`${definition.permission}:update`) || can(`${definition.permission}:manage`);
  const canDelete = can(`${definition.permission}:delete`) || can(`${definition.permission}:manage`);
  const header = useMemo(() => `${definition.label} management`, [definition.label]);

  const actions = (record: CmsRecord) => (
    <div className="flex justify-end gap-1">
      {canUpdate && (
        <button aria-label={`Edit ${recordName(record)}`} title="Edit" onClick={() => openEditor(record)} className="p-2 rounded-lg hover:bg-black/5 text-[#444]">
          <Edit3 size={16} />
        </button>
      )}
      {canUpdate && record.status && record.status !== "PUBLISHED" && record.status !== "ACTIVE" && record.status !== "OPEN" && (
        <button disabled={busyId === record.id} aria-label={`Publish ${recordName(record)}`} title="Publish" onClick={() => transition(record, "publish")} className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-700 disabled:opacity-40">
          <Send size={16} />
        </button>
      )}
      {canUpdate && (record.status === "PUBLISHED" || record.status === "OPEN") && (
        <button disabled={busyId === record.id} aria-label={`Move ${recordName(record)} to draft`} title="Move to draft" onClick={() => transition(record, "draft")} className="p-2 rounded-lg hover:bg-amber-50 text-amber-700 disabled:opacity-40">
          <Archive size={16} />
        </button>
      )}
      {canDelete && (
        <button aria-label={`Archive ${recordName(record)}`} title="Archive record" onClick={() => setPendingDelete(record)} className="p-2 rounded-lg hover:bg-red-50 text-red-600">
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
        <div>
          <p className="text-xs uppercase tracking-[.24em] font-semibold text-[#0B5E3C] mb-2">Content</p>
          <h1 className="text-3xl md:text-4xl text-[#1B1B1B]" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>{header}</h1>
          <p className="text-[#666] mt-2 max-w-2xl">{definition.description}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} disabled={loading} className="px-4 py-2.5 rounded-xl border border-black/10 bg-white inline-flex items-center gap-2 text-sm font-semibold disabled:opacity-50">
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          {canCreate && (
            <button onClick={() => openEditor("new")} className="px-4 py-2.5 rounded-xl bg-[#0B5E3C] text-white inline-flex items-center gap-2 text-sm font-semibold">
              <Plus size={16} /> Add new
            </button>
          )}
        </div>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (page !== 1) setPage(1);
          else load();
        }}
        className="bg-white rounded-2xl border border-black/6 p-3 flex gap-3 mb-5"
      >
        <label className="relative flex-1">
          <span className="sr-only">Search {definition.label}</span>
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888]" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} className="w-full rounded-xl bg-[#F5F6F3] pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0B5E3C]/20" placeholder={`Search ${definition.label.toLowerCase()}…`} />
        </label>
        <button className="px-5 rounded-xl bg-[#1B1B1B] text-white text-sm font-semibold">Search</button>
      </form>

      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-4 mb-5">{error}</div>}
      {notice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 p-4 mb-5">{notice}</div>}

      <div className="hidden md:block bg-white rounded-2xl border border-black/6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-[#F7F7F5] text-left">
              <tr>
                <th scope="col" className="px-5 py-4 text-xs uppercase tracking-wider text-[#777]">Record</th>
                <th scope="col" className="px-5 py-4 text-xs uppercase tracking-wider text-[#777]">Status</th>
                <th scope="col" className="px-5 py-4 text-xs uppercase tracking-wider text-[#777]">Data type</th>
                <th scope="col" className="px-5 py-4 text-xs uppercase tracking-wider text-[#777] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/6">
              {loading ? (
                <tr><td colSpan={4} className="py-16 text-center text-[#666]"><Loader2 className="animate-spin inline mr-2" size={18} /> Loading records…</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={4} className="py-16 text-center text-[#777]">No records found. {canCreate && "Use “Add new” to create the first one."}</td></tr>
              ) : items.map((record) => (
                <tr key={record.id} className="hover:bg-[#FAFAF8]">
                  <td className="px-5 py-4"><p className="font-semibold text-[#222]">{recordName(record)}</p><p className="text-xs text-[#888] mt-1">{record.id}</p></td>
                  <td className="px-5 py-4"><StatusBadge status={record.status} /></td>
                  <td className="px-5 py-4"><span className={`text-xs font-semibold ${record.isDemo ? "text-[#7A5600]" : "text-[#0B5E3C]"}`}>{record.isDemo ? "Demo" : "Real"}</span></td>
                  <td className="px-5 py-4">{actions(record)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="bg-white rounded-2xl p-10 text-center text-[#666]"><Loader2 className="animate-spin inline mr-2" size={18} />Loading records…</div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center text-[#777]">No records found.</div>
        ) : items.map((record) => (
          <article key={record.id} className="bg-white rounded-2xl border border-black/6 p-4">
            <div className="flex justify-between gap-3">
              <div className="min-w-0"><h2 className="font-semibold truncate">{recordName(record)}</h2><p className="text-xs text-[#888] truncate mt-1">{record.id}</p></div>
              <StatusBadge status={record.status} />
            </div>
            <div className="border-t border-black/6 mt-4 pt-2">{actions(record)}</div>
          </article>
        ))}
      </div>

      <div className="mt-4 bg-white rounded-2xl border border-black/6 px-5 py-4 flex items-center justify-between text-sm text-[#666]">
        <span>Page {page} of {totalPages}</span>
        <div className="flex gap-2">
          <button aria-label="Previous page" disabled={page <= 1 || loading} onClick={() => setPage((value) => value - 1)} className="p-2 border border-black/10 rounded-lg disabled:opacity-35"><ChevronLeft size={16} /></button>
          <button aria-label="Next page" disabled={page >= totalPages || loading} onClick={() => setPage((value) => value + 1)} className="p-2 border border-black/10 rounded-lg disabled:opacity-35"><ChevronRight size={16} /></button>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-5">
          <button aria-label="Close editor" onClick={() => setEditing(null)} className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
          <div role="dialog" aria-modal="true" aria-labelledby="resource-editor-title" className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[94vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-black/7 px-5 md:px-6 py-5 flex items-center justify-between z-10">
              <div>
                <p className="text-xs uppercase tracking-[.2em] text-[#0B5E3C] font-semibold">{editing === "new" ? "Create" : "Edit"}</p>
                <h2 id="resource-editor-title" tabIndex={-1} ref={editorTitleRef} className="text-2xl mt-1 outline-none" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>{definition.label}</h2>
              </div>
              <button aria-label="Close editor" type="button" onClick={() => setEditing(null)} className="p-2 rounded-lg hover:bg-black/5"><X size={20} /></button>
            </div>
            <form onSubmit={submit} className="p-5 md:p-6 space-y-5" noValidate>
              {definition.fields.map((field) => (
                <EditorField
                  key={field.key}
                  field={field}
                  value={form[field.key]}
                  error={fieldErrors[field.key]}
                  referenceOptions={field.referenceResource ? references[field.referenceResource] ?? [] : []}
                  onChange={(value) => setForm((current) => ({ ...current, [field.key]: value }))}
                />
              ))}
              {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-4">{error}</div>}
              <div className="pt-3 flex flex-col-reverse sm:flex-row justify-end gap-3">
                <button type="button" onClick={() => setEditing(null)} className="px-5 py-3 rounded-xl border border-black/10 font-semibold text-sm">Cancel</button>
                <button disabled={saving} className="px-6 py-3 rounded-xl bg-[#0B5E3C] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 disabled:opacity-60">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} {editing === "new" ? "Create record" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <button aria-label="Cancel archive" className="absolute inset-0 bg-black/60" onClick={() => setPendingDelete(null)} />
          <div role="alertdialog" aria-modal="true" aria-labelledby="archive-title" className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="w-11 h-11 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4"><Trash2 size={20} /></div>
            <h2 id="archive-title" className="text-2xl" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>Archive this record?</h2>
            <p className="text-[#666] mt-2">“{recordName(pendingDelete)}” will be removed from normal lists. The database keeps it for recovery and audit purposes.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setPendingDelete(null)} className="px-4 py-2.5 rounded-xl border border-black/10 font-semibold text-sm">Cancel</button>
              <button onClick={remove} disabled={busyId === pendingDelete.id} className="px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm disabled:opacity-60">Archive record</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const positive = status === "PUBLISHED" || status === "ACTIVE" || status === "OPEN";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${positive ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
      {status ?? "—"}
    </span>
  );
}

function EditorField({
  field,
  value,
  error,
  referenceOptions,
  onChange
}: {
  field: FieldDefinition;
  value: unknown;
  error?: string;
  referenceOptions: ReferenceOption[];
  onChange: (value: unknown) => void;
}) {
  const id = `field-${field.key}`;
  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-3 rounded-xl bg-[#F7F7F5] px-4 py-3">
        <input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} className="w-4 h-4 accent-[#0B5E3C]" />
        <span className="font-semibold text-sm">{field.label}</span>
      </label>
    );
  }
  if (field.type === "media" || field.type === "media-list") {
    return (
      <MediaPickerField
        label={field.label}
        required={field.required}
        multiple={field.type === "media-list"}
        value={(value as MediaAsset[]) ?? []}
        onChange={onChange}
      />
    );
  }

  const describedBy = error ? `${id}-error` : field.help ? `${id}-help` : undefined;
  const common = {
    id,
    required: field.required,
    "aria-invalid": Boolean(error),
    "aria-describedby": describedBy,
    value: String(value ?? ""),
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange(event.target.value),
    className: `w-full rounded-xl border px-4 py-3 outline-none focus:ring-4 focus:ring-[#0B5E3C]/10 ${error ? "border-red-400" : "border-black/10 focus:border-[#0B5E3C]"}`
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-[#333] mb-2">{field.label}{field.required && " *"}</label>
      {field.type === "textarea" || field.type === "json" ? (
        <textarea {...common} rows={field.type === "json" ? 5 : field.key === "body" || field.key === "description" ? 8 : 4} value={field.type === "json" && typeof value === "object" ? JSON.stringify(value, null, 2) : String(value ?? "")} spellCheck={field.type !== "json"} />
      ) : field.type === "select" ? (
        <select {...common} className={`${common.className} bg-white`}>
          {!field.required && !field.options?.includes("") && <option value="">Not set</option>}
          {field.options?.map((option) => <option key={option} value={option}>{option || "Not set"}</option>)}
        </select>
      ) : field.type === "reference" ? (
        <select {...common} className={`${common.className} bg-white`}>
          <option value="">Not set</option>
          {referenceOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
        </select>
      ) : (
        <input
          {...common}
          type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "email" ? "email" : field.type === "url" ? "url" : "text"}
          min={field.min}
          max={field.max}
          step={field.type === "number" ? "any" : undefined}
          placeholder={field.placeholder}
        />
      )}
      {field.help && !error && <p id={`${id}-help`} className="text-xs text-[#777] mt-1.5">{field.help}</p>}
      {error && <p id={`${id}-error`} role="alert" className="text-xs text-red-600 mt-1.5">{error}</p>}
    </div>
  );
}
