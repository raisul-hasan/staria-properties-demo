import { useId, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, X, ZoomIn } from "lucide-react";
import type { ProjectPhoto } from "../services/developmentProjects";

export function ProjectPhotoGallery({ title, label, photos, imageFit = "cover" }: { title: string; label: string; photos: readonly ProjectPhoto[]; imageFit?: "cover" | "contain" }) {
  const [visibleCount, setVisibleCount] = useState(6);
  const [selected, setSelected] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const headingId = useId();
  const photo = selected === null ? null : photos[selected];
  const move = (offset: number) => setSelected((current) => current === null ? null : (current + offset + photos.length) % photos.length);

  return (
    <section aria-labelledby={headingId}>
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 id={headingId} className="text-2xl text-[#082D1C]" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>{title}</h2>
        <span className="text-sm text-[#666666]">{photos.length} photos</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {photos.slice(0, visibleCount).map((item, index) => (
          <button key={item.src} type="button" onClick={(event) => { triggerRef.current = event.currentTarget; setSelected(index); }} aria-label={`Enlarge ${label}, ${item.caption ?? `photo ${index + 1}`}`} className="group overflow-hidden rounded-xl bg-[#E8E8E3] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B5E3C]">
            <span className="relative block overflow-hidden">
              <img src={item.thumbnail} alt={item.alt ?? `${label} — photo ${index + 1}`} width={item.width} height={item.height} loading="lazy" decoding="async" className={`aspect-[4/3] h-auto w-full ${imageFit === "contain" ? "object-contain" : "object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"}`} />
              <span aria-hidden="true" className="absolute right-2 bottom-2 rounded-full bg-black/55 p-2 text-white"><ZoomIn size={15} /></span>
            </span>
            {item.caption ? <span className="block bg-white px-3 py-3 text-sm font-medium leading-6 text-[#35483C]">{item.caption}</span> : null}
          </button>
        ))}
      </div>
      {visibleCount < photos.length && <button type="button" onClick={() => setVisibleCount((count) => count + 12)} className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full border border-[#0B5E3C]/25 px-6 py-3 text-sm font-semibold text-[#0B5E3C] transition-colors hover:bg-[#0B5E3C] hover:text-white">Show more photos <span className="font-normal">({photos.length - visibleCount} remaining)</span></button>}
      <Dialog.Root open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[400] bg-black/85" />
          <Dialog.Content aria-describedby={undefined} onCloseAutoFocus={(event) => { event.preventDefault(); triggerRef.current?.focus(); }} onKeyDown={(event) => { if (event.key === "ArrowRight") move(1); if (event.key === "ArrowLeft") move(-1); }} className="fixed top-1/2 left-1/2 z-[401] w-[94vw] max-w-[1400px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#111] p-3 text-white shadow-2xl sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <Dialog.Title className="text-sm sm:text-base">{label} · {selected === null ? "" : selected + 1} / {photos.length}</Dialog.Title>
              <Dialog.Close aria-label="Close photo" className="rounded-full p-2 hover:bg-white/15"><X size={22} /></Dialog.Close>
            </div>
            {photo && <img src={photo.src} alt={photo.alt ?? `${label} — photo ${(selected ?? 0) + 1}`} width={photo.width} height={photo.height} className="max-h-[72vh] w-full object-contain" />}
            <div className="mt-4 flex justify-between gap-4">
              <button type="button" onClick={() => move(-1)} className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 hover:bg-white/15"><ArrowLeft size={18} />Previous</button>
              <button type="button" onClick={() => move(1)} className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 hover:bg-white/15">Next<ArrowRight size={18} /></button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
