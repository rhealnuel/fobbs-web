"use client";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { galleryCategories, type GalleryCategory, type GalleryItem } from "@/data/gallery";

type Meta = Pick<GalleryItem, "id" | "label" | "category" | "ratio">;
const ratioNum = (r: string) => { const [a, b] = r.split("/").map(Number); return a / b; };

/** thumbs/full are rendered on the server (SiteImage) and passed in, so photos still resolve from public/images. */
export default function GalleryBrowser({ items, thumbs, full }: { items: Meta[]; thumbs: Record<string, ReactNode>; full: Record<string, ReactNode> }) {
  const reduce = useReducedMotion();
  const dlg = useRef<HTMLDialogElement>(null);
  const startX = useRef(0);
  const [cat, setCat] = useState<GalleryCategory | "All">("All");
  const [i, setI] = useState(0);
  const shown = useMemo(() => (cat === "All" ? items : items.filter((x) => x.category === cat)), [items, cat]);
  const cur = shown[Math.min(i, shown.length - 1)];
  const go = (n: number) => setI((n + shown.length) % shown.length);
  const count = (c: GalleryCategory | "All") => (c === "All" ? items.length : items.filter((x) => x.category === c).length);

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto w-[min(1240px,100%-2.5rem)]">
        <div role="group" aria-label="Photo category" className="mb-8 flex gap-6 overflow-x-auto border-b border-black/10">
          {(["All", ...galleryCategories] as const).map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}
              className={`min-h-11 whitespace-nowrap border-b-2 pb-2 text-sm font-medium transition-colors ${cat === c ? "border-gold text-ink" : "border-transparent text-muted hover:text-ink"}`}>
              {c} <span className="text-xs text-muted">{count(c)}</span>
            </button>
          ))}
        </div>

        <motion.ul key={cat} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="columns-2 gap-3 lg:columns-3">
          {shown.map((x, n) => (
            <li key={x.id} className="mb-3 break-inside-avoid">
              <button type="button" onClick={() => { setI(n); dlg.current?.showModal(); }} aria-label={`Open photo: ${x.label}`} className="group relative block w-full overflow-hidden">
                <div className="transition-transform duration-[900ms] ease-out group-hover:scale-105">{thumbs[x.id]}</div>
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 pb-3 pt-8 text-left text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">{x.label}</span>
              </button>
            </li>
          ))}
        </motion.ul>
      </div>

      <dialog ref={dlg} aria-label="Photo viewer" onKeyDown={(e) => { if (e.key === "ArrowLeft") go(i - 1); if (e.key === "ArrowRight") go(i + 1); }}
        onClick={(e) => { if (e.target === dlg.current) dlg.current?.close(); }} className="m-auto max-w-[94vw] bg-black p-0 text-white backdrop:bg-black/85">
        {cur && (
          <div style={{ width: `min(94vw, calc(76vh * ${ratioNum(cur.ratio)}), 1100px)` }}>
            <div onTouchStart={(e) => (startX.current = e.touches[0].clientX)} onTouchEnd={(e) => { const d = e.changedTouches[0].clientX - startX.current; if (Math.abs(d) > 50) go(d > 0 ? i - 1 : i + 1); }}>{full[cur.id]}</div>
            <div className="flex items-center justify-between gap-3 p-3 text-sm">
              <span>{cur.label} ({Math.min(i, shown.length - 1) + 1} of {shown.length})</span>
              <span className="flex gap-2">
                <button type="button" aria-label="Previous photo" onClick={() => go(i - 1)} className="grid h-11 w-11 place-items-center border border-white/30"><ChevronLeft size={18} /></button>
                <button type="button" aria-label="Next photo" onClick={() => go(i + 1)} className="grid h-11 w-11 place-items-center border border-white/30"><ChevronRight size={18} /></button>
                <button type="button" aria-label="Close" onClick={() => dlg.current?.close()} className="grid h-11 w-11 place-items-center border border-white/30"><X size={18} /></button>
              </span>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}