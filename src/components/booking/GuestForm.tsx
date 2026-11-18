"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { loadGuest, saveGuest, type GuestDetails } from "@/lib/draft";

type Errors = Partial<Record<keyof GuestDetails, string>>;
const box = "min-h-11 w-full border border-black/15 bg-warm px-3 text-base text-ink outline-none focus:border-gold aria-[invalid=true]:border-red-600";
const lbl = "flex flex-col gap-1 text-sm";

function validate(g: GuestDetails): Errors {
  const e: Errors = {};
  if (g.fullName.trim().length < 2) e.fullName = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(g.email.trim())) e.email = "Enter a valid email address, like name@example.com.";
  const digits = g.phone.replace(/[\s()+-]/g, "");
  if (!/^\d{7,15}$/.test(digits)) e.phone = "Enter a phone number with 7 to 15 digits.";
  if (g.requests.length > 500) e.requests = "Keep special requests under 500 characters.";
  return e;
}

export default function GuestForm({ nextQuery, backHref }: { nextQuery: string; backHref: string }) {
  const router = useRouter();
  const form = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});

  // Restore what the guest typed if they come back from the payment step.
  useEffect(() => {
    const g = loadGuest(), f = form.current;
    if (!g || !f) return;
    (Object.keys(g) as (keyof GuestDetails)[]).forEach((k) => { const el = f.elements.namedItem(k) as HTMLInputElement | null; if (el) el.value = g[k] ?? ""; });
  }, []);

  function submit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const f = new FormData(ev.currentTarget);
    const g: GuestDetails = { fullName: String(f.get("fullName") ?? ""), email: String(f.get("email") ?? ""), phone: String(f.get("phone") ?? ""), country: String(f.get("country") ?? ""), requests: String(f.get("requests") ?? "") };
    const e = validate(g);
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) return void (form.current?.elements.namedItem(first) as HTMLElement | null)?.focus();
    saveGuest({ ...g, fullName: g.fullName.trim(), email: g.email.trim(), phone: g.phone.trim() });
    router.push(`/book/payment?${nextQuery}`);
  }

  const err = (k: keyof GuestDetails) => errors[k] && <span id={`${k}-err`} role="alert" className="text-sm text-red-700">{errors[k]}</span>;
  const aria = (k: keyof GuestDetails) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-err` : undefined });

  return (
    <form ref={form} onSubmit={submit} noValidate className="space-y-5">
      <label className={lbl}>Full name<input name="fullName" autoComplete="name" className={box} {...aria("fullName")} />{err("fullName")}</label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className={lbl}>Email<input name="email" type="email" autoComplete="email" className={box} {...aria("email")} />{err("email")}</label>
        <label className={lbl}>Phone number<input name="phone" type="tel" autoComplete="tel" className={box} {...aria("phone")} />{err("phone")}</label>
      </div>
      <label className={lbl}>Country <span className="text-muted">(optional)</span><input name="country" autoComplete="country-name" className={box} /></label>
      <label className={lbl}>Special requests <span className="text-muted">(optional)</span>
        <textarea name="requests" rows={4} maxLength={600} className={`${box} py-2`} {...aria("requests")} />{err("requests")}
        <span className="text-xs text-muted">Requests are passed to the hotel but can’t be guaranteed.</span>
      </label>
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button type="submit" className="min-h-12 bg-gold px-8 font-semibold text-black transition-colors hover:bg-champagne">Continue to payment</button>
        <Link href={backHref} className="text-sm underline underline-offset-4 hover:text-gold">Change my selection</Link>
      </div>
    </form>
  );
}