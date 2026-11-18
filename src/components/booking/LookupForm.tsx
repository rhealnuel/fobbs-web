"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { Printer, Search } from "lucide-react";
import BookingSheet from "@/components/booking/BookingSheet";
import { LOOKUP_NOT_FOUND, paymentService, type Booking } from "@/services/payment";

type Phase = "idle" | "searching" | "found" | "notfound" | "error";
type Errors = { ref?: string; contact?: string };
const box = "min-h-11 w-full border border-black/15 bg-warm px-3 text-base text-ink outline-none focus:border-gold aria-[invalid=true]:border-red-600";

export default function LookupForm({ initialRef }: { initialRef: string }) {
  const form = useRef<HTMLFormElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");

  async function submit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const f = new FormData(ev.currentTarget);
    const ref = String(f.get("ref") ?? "").trim().toUpperCase();
    const contact = String(f.get("contact") ?? "").trim();
    const e: Errors = {};
    if (!/^[A-Z0-9-]{4,24}$/.test(ref)) e.ref = "Enter your booking reference, like FOB-7K3M9X.";
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact);
    const isPhone = /^\d{7,15}$/.test(contact.replace(/[\s()+-]/g, ""));
    if (!isEmail && !isPhone) e.contact = "Enter the email address or phone number used for the booking.";
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) return void (form.current?.elements.namedItem(first) as HTMLElement | null)?.focus();

    setPhase("searching"); setBooking(null);
    const r = await paymentService.lookup(ref, contact);
    if (r.ok) { setBooking(r.data); setPhase("found"); }
    else if (r.error === LOOKUP_NOT_FOUND) setPhase("notfound");
    else { setMessage(r.error); setPhase("error"); }
  }

  const err = (k: keyof Errors) => errors[k] && <span id={`${k}-err`} role="alert" className="text-sm text-red-700">{errors[k]}</span>;
  const aria = (k: keyof Errors) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-err` : undefined });

  if (phase === "found" && booking) {
    return (
      <div className="mx-auto w-[min(820px,100%-2.5rem)]">
        <BookingSheet b={booking} />
        <div className="mt-8 flex flex-wrap justify-center gap-3 print:hidden">
          <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 border border-black/25 px-6 py-3 font-semibold hover:border-gold"><Printer size={16} />Print or save as PDF</button>
          {booking.paymentStatus !== "successful" && (
            <Link href={`/book/payment?${new URLSearchParams({ checkIn: booking.checkIn, checkOut: booking.checkOut, adults: String(booking.adults), children: String(booking.children), slug: booking.slug })}`} className="bg-gold px-6 py-3 font-semibold text-black hover:bg-champagne">Continue to payment</Link>
          )}
          <button type="button" onClick={() => setPhase("idle")} className="bg-black px-6 py-3 font-semibold text-white hover:bg-charcoal">Look up another booking</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-[min(560px,100%-2.5rem)]">
      <form ref={form} onSubmit={submit} noValidate className="space-y-5 border border-black/10 bg-white p-6 md:p-8">
        <label className="flex flex-col gap-1 text-sm">Booking reference
          <input name="ref" defaultValue={initialRef} autoCapitalize="characters" autoComplete="off" spellCheck={false} placeholder="FOB-XXXXXX" className={`${box} font-mono uppercase`} {...aria("ref")} />{err("ref")}
        </label>
        <label className="flex flex-col gap-1 text-sm">Email address or phone number
          <input name="contact" autoComplete="email" className={box} {...aria("contact")} />{err("contact")}
          <span className="text-xs text-muted">Use the same email or phone number you gave when you booked.</span>
        </label>
        <button type="submit" disabled={phase === "searching"} className="flex min-h-12 w-full items-center justify-center gap-2 bg-gold font-semibold text-black transition-colors hover:bg-champagne disabled:opacity-60"><Search size={18} />{phase === "searching" ? "Looking…" : "Find my booking"}</button>
        <div aria-live="polite">
          {phase === "notfound" && <p role="alert" className="border-l-2 border-red-600 bg-red-50 p-4 text-sm">We couldn’t find a booking with those details. Check the reference and the email or phone number, then try again.</p>}
          {phase === "error" && <p role="alert" className="border-l-2 border-red-600 bg-red-50 p-4 text-sm">{message}</p>}
        </div>
      </form>
    </div>
  );
}