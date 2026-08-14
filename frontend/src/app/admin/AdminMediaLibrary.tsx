import { useEffect, useMemo, useRef, useState } from "react";
import { Check, FileText, Image as ImageIcon, Loader2, Search, Upload, X } from "lucide-react";
import { api, type MediaAsset } from "../services/api";
import { useAdminAuth } from "./AdminAuth";

type MediaLibraryProps = {
  selectable?: boolean;
  multiple?: boolean;
  selectedIds?: string[];
  onSelect?: (assets: MediaAsset[]) => void;
  onClose?: () => void;
};

function MediaLibrary({ selectable = false, multiple = false, selectedIds = [], onSelect, onClose }: MediaLibraryProps) {
  const { can } = useAdminAuth();
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [selected, setSelected] = useState<string[]>(selectedIds);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [altText, setAltText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.listMedia({ limit: 100, search });
      setItems(result.items);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The media library could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const upload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const asset = await api.uploadMedia(file, altText, file.type.startsWith("image/") ? "image" : "file");
      setItems((current) => [asset, ...current]);
      setAltText("");
      if (selectable) setSelected((current) => (multiple ? [...new Set([...current, asset.id])] : [asset.id]));
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Upload failed.";
      setError(
        message.includes("Cloudinary")
          ? "Media upload needs Cloudinary credentials. Existing demo media can still be selected; see docs/phase-4-local-setup.md."
          : message
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const toggle = (id: string) => {
    if (!selectable) return;
    setSelected((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : multiple
          ? [...current, id]
          : [id]
    );
  };

  const confirmSelection = () => {
    onSelect?.(items.filter((item) => selected.includes(item.id)));
  };

  return (
    <div className="bg-white rounded-2xl border border-black/7 overflow-hidden">
      <div className="p-5 border-b border-black/7 flex flex-col xl:flex-row xl:items-end gap-4 justify-between">
        <div>
          <p className="text-xs uppercase tracking-[.2em] text-[#0B5E3C] font-semibold">Media library</p>
          <h2 className="text-2xl mt-1" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>
            Images and documents
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {can("media:upload") && (
            <>
              <input
                value={altText}
                onChange={(event) => setAltText(event.target.value)}
                className="rounded-xl border border-black/10 px-3 py-2.5 text-sm"
                placeholder="Image description (recommended)"
                aria-label="Alternative text for uploaded image"
              />
              <input ref={fileRef} className="sr-only" type="file" accept="image/*,.pdf" onChange={upload} />
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
                className="rounded-xl bg-[#0B5E3C] text-white px-4 py-2.5 text-sm font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                Upload
              </button>
            </>
          )}
        </div>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          load();
        }}
        className="p-4 border-b border-black/7 flex gap-2"
      >
        <label className="relative flex-1">
          <span className="sr-only">Search media</span>
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl bg-[#F5F6F3] pl-10 pr-4 py-2.5"
            placeholder="Search by description or filename"
          />
        </label>
        <button className="rounded-xl bg-[#1B1B1B] text-white px-5 text-sm font-semibold">Search</button>
      </form>

      {error && <div role="alert" className="m-4 rounded-xl bg-red-50 border border-red-200 text-red-700 p-4">{error}</div>}
      <div className="p-4 min-h-64">
        {loading ? (
          <div className="py-20 text-center text-[#666]"><Loader2 className="animate-spin inline mr-2" size={18} />Loading media…</div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center">
            <ImageIcon className="mx-auto text-[#AAA] mb-3" />
            <p className="font-semibold text-[#444]">No media found</p>
            <p className="text-sm text-[#777] mt-1">Upload an image or clear the search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {items.map((item) => {
              const isSelected = selected.includes(item.id);
              const image = item.resourceType === "IMAGE" || /\.(jpe?g|png|webp|gif|avif)(\?|$)/i.test(item.secureUrl);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-pressed={selectable ? isSelected : undefined}
                  className={`relative text-left rounded-xl overflow-hidden border-2 bg-[#F5F6F3] focus:outline-none focus:ring-4 focus:ring-[#0B5E3C]/20 ${
                    isSelected ? "border-[#0B5E3C]" : "border-transparent"
                  }`}
                >
                  <div className="aspect-square flex items-center justify-center overflow-hidden">
                    {image ? (
                      <img src={item.secureUrl} alt={item.altText || ""} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <FileText size={36} className="text-[#777]" />
                    )}
                  </div>
                  <div className="p-2 bg-white">
                    <p className="text-xs font-semibold truncate">{item.altText || item.format || "Media asset"}</p>
                    <p className="text-[10px] text-[#888] truncate mt-0.5">{item.id}</p>
                  </div>
                  {isSelected && <span className="absolute top-2 right-2 rounded-full bg-[#0B5E3C] text-white p-1"><Check size={13} /></span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selectable && (
        <div className="p-4 border-t border-black/7 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-xl border border-black/10 px-5 py-2.5 text-sm font-semibold">Cancel</button>
          <button type="button" onClick={confirmSelection} className="rounded-xl bg-[#0B5E3C] text-white px-5 py-2.5 text-sm font-semibold">
            Use selected ({selected.length})
          </button>
        </div>
      )}
    </div>
  );
}

export function MediaPickerField({
  label,
  value,
  onChange,
  multiple = false,
  required = false
}: {
  label: string;
  value: MediaAsset[];
  onChange: (assets: MediaAsset[]) => void;
  multiple?: boolean;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selectedIds = useMemo(() => value.map((item) => item.id), [value]);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-sm font-semibold text-[#333]">{label}{required && " *"}</span>
        <button type="button" onClick={() => setOpen(true)} className="text-sm font-semibold text-[#0B5E3C]">Browse library</button>
      </div>
      <div className="rounded-xl border border-black/10 p-3 min-h-20">
        {value.length === 0 ? (
          <button type="button" onClick={() => setOpen(true)} className="w-full py-4 text-sm text-[#777]">No media selected</button>
        ) : (
          <div className="flex flex-wrap gap-2">
            {value.map((item) => (
              <div key={item.id} className="relative w-24 rounded-lg overflow-hidden bg-[#F5F6F3] border border-black/8">
                <img src={item.secureUrl} alt={item.altText || ""} className="w-24 h-20 object-cover" />
                <button
                  type="button"
                  aria-label={`Remove ${item.altText || "media"}`}
                  onClick={() => onChange(value.filter((asset) => asset.id !== item.id))}
                  className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {open && (
        <div role="dialog" aria-modal="true" aria-label={`Select ${label}`} className="fixed inset-0 z-[120] overflow-y-auto p-4 md:p-8">
          <button aria-label="Close media library" className="fixed inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative max-w-6xl mx-auto">
            <MediaLibrary
              selectable
              multiple={multiple}
              selectedIds={selectedIds}
              onClose={() => setOpen(false)}
              onSelect={(assets) => {
                onChange(assets);
                setOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminMediaPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[.24em] font-semibold text-[#0B5E3C] mb-2">Assets</p>
        <h1 className="text-4xl text-[#1B1B1B]" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>Media management</h1>
        <p className="text-[#666] mt-2">Browse existing media or upload images and PDFs for use across the website.</p>
      </div>
      <MediaLibrary />
    </div>
  );
}
