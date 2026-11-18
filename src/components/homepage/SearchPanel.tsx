"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { accommodations } from "@/data/accommodations";

const iso = (d: Date) => d.toISOString().slice(0, 10);
const field = "flex flex-col gap-1 border-b border-black/10 px-5 py-3 text-xs text-muted lg:border-b-0 lg:border-r";
const input = "min-h-9 w-full bg-transparent text-base font-medium text-ink outline-none";

export default function SearchPanel() {
  const router = useRouter();
  const inRef = useRef<HTMLInputElement>(null);
  const outRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (inRef.current) inRef.current.min = iso(new Date());
  }, []);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const checkIn = String(f.get("checkIn") || "");
    const checkOut = String(f.get("checkOut") || "");
    if (!checkIn) return fail("Choose a check-in date.", inRef.current);
    if (checkIn < iso(new Date())) return fail("Check-in can’t be in the past.", inRef.current);
    if (!checkOut) return fail("Choose a check-out date.", outRef.current);
    if (checkOut <= checkIn) return fail("Check-out must be after check-in.", outRef.current);
    setError("");
    const q = new URLSearchParams({ checkIn, checkOut, adults: String(f.get("adults")), children: String(f.get("children")) });
    const type = String(f.get("type") || "");
    if (type) q.set("type", type);
    router.push(`/book?${q.toString()}`);
  }
  function fail(msg: string, el: HTMLElement | null) {
    setError(msg);
    el?.focus();
  }

  return (
    <form onSubmit={submit} noValidate className="border-t-2 border-gold bg-warm shadow-[0_24px_50px_rgba(0,0,0,.2)]">
      <div className="grid lg:grid-cols-[repeat(5,1fr)_auto]">
        <label className={field}>Check-in<input ref={inRef} name="checkIn" type="date" className={input} onChange={(e) => outRef.current && (outRef.current.min = e.target.value)} /></label>
        <label className={field}>Check-out<input ref={outRef} name="checkOut" type="date" className={input} /></label>
        <label className={field}>Adults<select name="adults" defaultValue="2" className={input}>{[1, 2, 3, 4, 5, 6].map((n) => <option key={n}>{n}</option>)}</select></label>
        <label className={field}>Children<select name="children" defaultValue="0" className={input}>{[0, 1, 2, 3, 4].map((n) => <option key={n}>{n}</option>)}</select></label>
        <label className={field}>Accommodation
          <select name="type" className={input}><option value="">Any</option>{accommodations.map((a) => <option key={a.slug} value={a.slug}>{a.name}</option>)}</select>
        </label>
        <button type="submit" className="flex min-h-16 items-center justify-center gap-2 bg-gold px-8 font-semibold text-black transition-colors hover:bg-champagne"><Search size={18} />Search Availability</button>
      </div>
      <p role="status" aria-live="polite" className={`px-5 text-sm text-red-700 ${error ? "border-t border-black/10 py-3" : ""}`}>{error}</p>
    </form>
  );
}