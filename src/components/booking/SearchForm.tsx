"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Search } from "lucide-react";
import { accommodations } from "@/data/accommodations";
import type { BookingQuery } from "@/types/booking";

const box = "min-h-11 w-full border border-black/15 bg-warm px-3 text-base text-ink outline-none focus:border-gold";
const lbl = "flex flex-col gap-1 text-xs text-muted";

export default function SearchForm({ initial, serverError }: { initial: BookingQuery | null; serverError: string | null }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const inRef = useRef<HTMLInputElement>(null);
  const [checkIn, setCheckIn] = useState(initial?.checkIn ?? "");
  const [checkOut, setCheckOut] = useState(initial?.checkOut ?? "");
  const [error, setError] = useState(serverError ?? "");

  useEffect(() => { if (inRef.current) inRef.current.min = new Date().toISOString().slice(0, 10); }, []);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (!checkIn || !checkOut) return setError("Choose both a check-in and a check-out date.");
    if (checkOut <= checkIn) return setError("Check-out must be after check-in.");
    setError("");
    const q = new URLSearchParams({ checkIn, checkOut, adults: String(f.get("adults")), children: String(f.get("children")) });
    const type = String(f.get("type") || "");
    if (type) q.set("type", type);
    start(() => router.push(`/book?${q}`));
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(5,1fr)_auto]">
        <label className={lbl}>Check-in<input ref={inRef} type="date" className={box} value={checkIn} onChange={(e) => { setCheckIn(e.target.value); setError(""); }} /></label>
        <label className={lbl}>Check-out<input type="date" min={checkIn || undefined} className={box} value={checkOut} onChange={(e) => { setCheckOut(e.target.value); setError(""); }} /></label>
        <label className={lbl}>Adults<select name="adults" defaultValue={initial?.adults ?? 2} className={box}>{[1, 2, 3, 4, 5, 6].map((n) => <option key={n}>{n}</option>)}</select></label>
        <label className={lbl}>Children<select name="children" defaultValue={initial?.children ?? 0} className={box}>{[0, 1, 2, 3, 4].map((n) => <option key={n}>{n}</option>)}</select></label>
        <label className={lbl}>Accommodation
          <select name="type" defaultValue={initial?.type ?? ""} className={box}>
            <option value="">Any</option>
            <optgroup label="Type"><option value="room">Hotel rooms</option><option value="apartment">Serviced apartments</option></optgroup>
            <optgroup label="Specific">{accommodations.map((a) => <option key={a.slug} value={a.slug}>{a.name}</option>)}</optgroup>
          </select>
        </label>
        <button type="submit" disabled={pending} className="flex min-h-11 items-center justify-center gap-2 self-end bg-gold px-6 font-semibold text-black transition-colors hover:bg-champagne disabled:opacity-60"><Search size={18} />{pending ? "Searching…" : "Search"}</button>
      </div>
      <p role="alert" className="mt-3 min-h-5 text-sm text-red-700">{error}</p>
    </form>
  );
}