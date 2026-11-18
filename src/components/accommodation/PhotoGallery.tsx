"use client";
import { useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";

/** thumbs and full are rendered on the server (SiteImage) and passed in, so photos still resolve from public/images. */
export default function PhotoGallery({ thumbs, full, labels }: { thumbs: ReactNode[]; full: ReactNode[]; labels: string[] }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const startX = useRef(0);
  const [i, setI] = useState(0);
  const go = (n: number) => setI((n + full.length) % full.length);
  const open = (n: number) => { setI(n); dlg.current?.showModal(); };
  const last = Math.min(3, thumbs.length - 1);

  return (
    <>
      <div className="-mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 md:mx-0 md:grid md:h-[520px] md:grid-cols-4 md:grid-rows-2 md:overflow-visible md:px-0">
        {thumbs.map((t, n) => (
          <button key={n} type="button" onClick={() => open(n)} aria-label={`Open photo ${n + 1} of ${thumbs.length}: ${labels[n]}`}
            className={`group relative aspect-[4/3] w-[85%] shrink-0 snap-center overflow-hidden md:aspect-auto md:w-auto ${n === 0 ? "md:col-span-2 md:row-span-2" : ""} ${n > 3 ? "md:hidden" : ""}`}>
            <div className="absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-105">{t}</div>
            {n === last && <span className="absolute bottom-3 right-3 hidden items-center gap-2 bg-black/80 px-3 py-2 text-sm text-white md:flex"><Images size={16} />View all {thumbs.length} photos</span>}
          </button>
        ))}
      </div>

      <dialog ref={dlg} aria-label="Photo gallery"
        onKeyDown={(e) => { if (e.key === "ArrowLeft") go(i - 1); if (e.key === "ArrowRight") go(i + 1); }}
        onClick={(e) => { if (e.target === dlg.current) dlg.current?.close(); }}
        className="m-auto w-[min(960px,94vw,calc(80vh*1.5))] bg-black p-0 text-white backdrop:bg-black/85">
        <div onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => { const d = e.changedTouches[0].clientX - startX.current; if (Math.abs(d) > 50) go(d > 0 ? i - 1 : i + 1); }}>
          {full[i]}
        </div>
        <div className="flex items-center justify-between gap-3 p-3 text-sm">
          <span>{labels[i]} ({i + 1} of {full.length})</span>
          <span className="flex gap-2">
            <button type="button" aria-label="Previous photo" onClick={() => go(i - 1)} className="grid h-11 w-11 place-items-center border border-white/30"><ChevronLeft size={18} /></button>
            <button type="button" aria-label="Next photo" onClick={() => go(i + 1)} className="grid h-11 w-11 place-items-center border border-white/30"><ChevronRight size={18} /></button>
            <button type="button" aria-label="Close" onClick={() => dlg.current?.close()} className="grid h-11 w-11 place-items-center border border-white/30"><X size={18} /></button>
          </span>
        </div>
      </dialog>
    </>
  );
}