"use client";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import type { FaqItem } from "@/config/faq";

export default function Accordion({ items }: { items: FaqItem[] }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<Set<number>>(new Set());
  const toggle = (i: number) => setOpen((s) => { const n = new Set(s); if (n.has(i)) n.delete(i); else n.add(i); return n; });

  return (
    <ul className="border-t border-black/10">
      {items.map((it, i) => {
        const isOpen = open.has(i);
        return (
          <li key={it.q} className="border-b border-black/10">
            <h3>
              <button type="button" id={`faq-q-${i}`} aria-expanded={isOpen} aria-controls={`faq-a-${i}`} onClick={() => toggle(i)}
                className="flex min-h-14 w-full items-center justify-between gap-6 py-5 text-left font-serif text-xl transition-colors hover:text-gold md:text-2xl">
                {it.q}
                <Plus size={22} className={`shrink-0 text-gold transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className="overflow-hidden"
                  initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}>
                  <div className="max-w-[62ch] pb-6 text-muted">
                    <p>{it.a}</p>
                    {it.link && <Link href={it.link.href} className="mt-3 inline-block font-semibold text-ink underline decoration-gold underline-offset-4">{it.link.label}</Link>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}