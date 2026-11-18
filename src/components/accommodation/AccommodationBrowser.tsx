"use client";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SearchX } from "lucide-react";
import type { Accommodation, AccommodationType } from "@/types/accommodation";

type TypeFilter = AccommodationType | "all";
type Sort = "recommended" | "low" | "high";

const typeOptions: { label: string; value: TypeFilter }[] = [
  { label: "All", value: "all" },
  { label: "Hotel rooms", value: "Hotel room" },
  { label: "Serviced apartments", value: "Serviced apartment" },
];
const box = "min-h-11 w-full border border-black/15 bg-warm px-3 text-base text-ink outline-none focus:border-gold disabled:opacity-50";
const lbl = "flex flex-col gap-1 text-xs text-muted";

function typeFromParam(p: string | null, items: Accommodation[]): TypeFilter {
  if (!p) return "all";
  if (p === "apartment") return "Serviced apartment";
  if (p === "room" || p === "hotel") return "Hotel room";
  return items.find((i) => i.slug === p)?.type ?? "all";
}

export default function AccommodationBrowser({ items, cards }: { items: Accommodation[]; cards: Record<string, ReactNode> }) {
  const sp = useSearchParams();
  const anyPrice = items.some((i) => i.pricePerNight !== null);
  const [type, setType] = useState<TypeFilter>(() => typeFromParam(sp.get("type"), items));
  const [guests, setGuests] = useState(() => (Number(sp.get("adults") || 0) + Number(sp.get("children") || 0)) || 0);
  const [minP, setMinP] = useState("");
  const [maxP, setMaxP] = useState("");
  const [checkIn, setCheckIn] = useState(sp.get("checkIn") ?? "");
  const [checkOut, setCheckOut] = useState(sp.get("checkOut") ?? "");
  const [sort, setSort] = useState<Sort>("recommended");

  const dateError = checkIn && checkOut && checkOut <= checkIn ? "Check-out must be after check-in." : "";
  const datesSet = checkIn && checkOut && !dateError;

  const results = useMemo(() => {
    const list = items.filter((i) =>
      (type === "all" || i.type === type) &&
      (!guests || i.maxGuests >= guests) &&
      (!minP || (i.pricePerNight !== null && i.pricePerNight >= Number(minP))) &&
      (!maxP || (i.pricePerNight !== null && i.pricePerNight <= Number(maxP))));
    if (sort === "recommended") return list;
    const p = (a: Accommodation) => a.pricePerNight ?? Infinity;
    return [...list].sort((a, b) => (sort === "low" ? p(a) - p(b) : (b.pricePerNight ?? -1) - (a.pricePerNight ?? -1)));
  }, [items, type, guests, minP, maxP, sort]);

  const reset = () => { setType("all"); setGuests(0); setMinP(""); setMaxP(""); setCheckIn(""); setCheckOut(""); setSort("recommended"); };

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto w-[min(1240px,100%-2.5rem)]">
        <div role="group" aria-label="Accommodation type" className="mb-6 flex gap-6 overflow-x-auto border-b border-black/10">
          {typeOptions.map((o) => (
            <button key={o.value} type="button" aria-pressed={type === o.value} onClick={() => setType(o.value)}
              className={`min-h-11 whitespace-nowrap border-b-2 pb-2 text-sm font-medium transition-colors ${type === o.value ? "border-gold text-ink" : "border-transparent text-muted hover:text-ink"}`}>{o.label}</button>
          ))}
        </div>

        <div className="grid gap-3 bg-cream p-4 sm:grid-cols-2 lg:grid-cols-6">
          <label className={lbl}>Check-in<input type="date" className={box} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} /></label>
          <label className={lbl}>Check-out<input type="date" className={box} min={checkIn || undefined} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} /></label>
          <label className={lbl}>Guests
            <select className={box} value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
              <option value={0}>Any</option>{[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}{n === 6 ? "+" : ""}</option>)}
            </select>
          </label>
          <label className={lbl}>Min price (₦)<input type="number" min={0} inputMode="numeric" className={box} disabled={!anyPrice} value={minP} onChange={(e) => setMinP(e.target.value)} /></label>
          <label className={lbl}>Max price (₦)<input type="number" min={0} inputMode="numeric" className={box} disabled={!anyPrice} value={maxP} onChange={(e) => setMaxP(e.target.value)} /></label>
          <label className={lbl}>Sort by
            <select className={box} value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="recommended">Recommended</option>
              <option value="low" disabled={!anyPrice}>Price: low to high</option>
              <option value="high" disabled={!anyPrice}>Price: high to low</option>
            </select>
          </label>
        </div>
        <div role="status" aria-live="polite" className="mt-3 min-h-5 text-sm">
          {dateError ? <span className="text-red-700">{dateError}</span> : datesSet ? <span className="text-muted">Live availability for these dates isn’t connected yet. It will be confirmed when you book.</span> : !anyPrice ? <span className="text-muted">Price filters and sorting turn on once room prices are configured.</span> : null}
        </div>

        <div className="mb-6 mt-4 flex items-center justify-between text-sm text-muted">
          <span>{results.length} {results.length === 1 ? "option" : "options"}</span>
          <button type="button" onClick={reset} className="underline underline-offset-4 hover:text-ink">Reset filters</button>
        </div>

        {results.length === 0 ? (
          <div className="grid place-items-center border border-dashed border-black/20 px-6 py-20 text-center">
            <SearchX className="mb-4 text-gold" size={32} />
            <h2 className="font-serif text-2xl">Nothing matches those filters</h2>
            <p className="mt-2 max-w-[40ch] text-muted">Try fewer guests, a different type, or clear the price range.</p>
            <button type="button" onClick={reset} className="mt-6 bg-gold px-6 py-3 font-semibold text-black hover:bg-champagne">Clear filters</button>
          </div>
        ) : (
          <ul className="grid gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {results.map((a) => (
                <motion.li key={a.slug} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                  {cards[a.slug]}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </section>
  );
}