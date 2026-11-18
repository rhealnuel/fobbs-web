"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { calcPrice, fmt, nightsBetween } from "@/lib/pricing";

const box = "min-h-11 w-full border border-black/15 bg-warm px-3 text-base text-ink outline-none focus:border-gold";
const lbl = "flex flex-col gap-1 text-xs text-muted";

export default function BookingPanel({ slug, name, rate, maxGuests }: { slug: string; name: string; rate: number | null; maxGuests: number }) {
  const router = useRouter();
  const sp = useSearchParams();
  const inRef = useRef<HTMLInputElement>(null);
  const [checkIn, setCheckIn] = useState(sp.get("checkIn") ?? "");
  const [checkOut, setCheckOut] = useState(sp.get("checkOut") ?? "");
  const [guests, setGuests] = useState(Math.min(maxGuests, Math.max(1, Number(sp.get("adults") || 2) + Number(sp.get("children") || 0))));
  const [error, setError] = useState("");

  useEffect(() => { if (inRef.current) inRef.current.min = new Date().toISOString().slice(0, 10); }, []);

  const valid = checkIn && checkOut && checkOut > checkIn;
  const nights = valid ? nightsBetween(checkIn, checkOut) : 0;
  const price = valid && rate ? calcPrice(rate, nights) : null;

  function reserve() {
    if (!checkIn || !checkOut) return setError("Choose your check-in and check-out dates.");
    if (!valid) return setError("Check-out must be after check-in.");
    setError("");
    router.push(`/book?${new URLSearchParams({ type: slug, checkIn, checkOut, adults: String(guests), children: "0" })}`);
  }

  return (
    <>
      <aside id="reserve" aria-label={`Reserve ${name}`} className="scroll-mt-24 border-t-2 border-gold bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,.08)] lg:sticky lg:top-24">
        <p className="font-serif text-3xl">{rate ? fmt(rate) : "Price to be configured"}{rate && <span className="font-sans text-sm text-muted"> per night</span>}</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <label className={lbl}>Check-in<input ref={inRef} type="date" className={box} value={checkIn} onChange={(e) => { setCheckIn(e.target.value); setError(""); }} /></label>
          <label className={lbl}>Check-out<input type="date" min={checkIn || undefined} className={box} value={checkOut} onChange={(e) => { setCheckOut(e.target.value); setError(""); }} /></label>
          <label className={`${lbl} col-span-2`}>Guests
            <select className={box} value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
              {Array.from({ length: maxGuests }, (_, n) => n + 1).map((n) => <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>)}
            </select>
          </label>
        </div>
        <p role="alert" className="mt-3 min-h-5 text-sm text-red-700">{error}</p>

        <dl className="mt-2 space-y-2 border-t border-black/10 pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-muted">Nights</dt><dd>{valid ? nights : "–"}</dd></div>
          {price && <div className="flex justify-between"><dt className="text-muted">{fmt(rate!)} x {nights} {nights === 1 ? "night" : "nights"}</dt><dd>{fmt(price.subtotal)}</dd></div>}
          {price?.lines.map((l) => <div key={l.label} className="flex justify-between"><dt className="text-muted">{l.label}</dt><dd>{fmt(l.amount)}</dd></div>)}
          <div className="flex justify-between border-t border-black/10 pt-3 text-base font-semibold"><dt>Total</dt><dd>{price ? fmt(price.total) : valid ? "To be confirmed" : "–"}</dd></div>
        </dl>
        <p className="mt-3 text-xs text-muted">Availability is confirmed when you book. No payment is taken on this page.</p>
        <button type="button" onClick={reserve} className="mt-4 min-h-12 w-full bg-gold font-semibold text-black transition-colors hover:bg-champagne">Reserve Now</button>
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-gold/40 bg-black px-5 py-3 text-white lg:hidden">
        <span className="font-serif text-lg">{rate ? <>{fmt(rate)}<span className="font-sans text-xs text-white/70"> per night</span></> : "Price to be configured"}</span>
        <a href="#reserve" className="bg-gold px-5 py-3 text-sm font-semibold text-black">Reserve</a>
      </div>
    </>
  );
}