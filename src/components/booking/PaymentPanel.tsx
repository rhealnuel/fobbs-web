"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useSyncExternalStore } from "react";
import { CircleAlert, Clock, FlaskConical, XCircle } from "lucide-react";
import { paymentMethods, paymentMode } from "@/config/payments";
import { GUEST_KEY, parseGuest } from "@/lib/draft";
import { fmt } from "@/lib/pricing";
import { paymentService, simulatePayment, type Booking, type Result } from "@/services/payment";

type Phase = "ready" | "working" | "pending" | "verifying" | "failed" | "error";
type Stay = { slug: string; checkIn: string; checkOut: string; adults: number; children: number };

const noopSubscribe = () => () => {};
const banner = "flex gap-3 border-l-2 p-4 text-sm";

export default function PaymentPanel({ stay, total, guestHref }: { stay: Stay; total: number | null; guestHref: string }) {
  const router = useRouter();
  // undefined = still reading the browser, null = no saved guest details
  const raw = useSyncExternalStore<string | null | undefined>(noopSubscribe, () => sessionStorage.getItem(GUEST_KEY), () => undefined);
  const guest = useMemo(() => parseGuest(raw), [raw]);
  const [phase, setPhase] = useState<Phase>("ready");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [message, setMessage] = useState("");

  if (raw === undefined) return <div className="h-72 animate-pulse bg-cream" aria-hidden />;
  if (!guest) {
    return (
      <div role="alert" className="border border-black/10 bg-white p-8">
        <h2 className="font-serif text-2xl">Add your details first</h2>
        <p className="mb-5 mt-2 text-muted">We don’t have your guest details yet.</p>
        <Link href={guestHref} className="inline-block bg-gold px-6 py-3 font-semibold text-black hover:bg-champagne">Enter guest details</Link>
      </div>
    );
  }

  const fail = (m: string) => { setMessage(m); setPhase("error"); };
  const unwrap = <T,>(r: Result<T>) => (r.ok ? r.data : (fail(r.error), null));

  async function pay() {
    if (!guest) return;
    setPhase("working"); setMessage("");
    let b = booking;
    if (!b) { b = unwrap(await paymentService.createBooking({ ...stay, guest, total })); if (!b) return; setBooking(b); }
    const init = unwrap(await paymentService.initialize(b.reference));
    if (!init) return;
    if (init.authorizationUrl) { window.location.assign(init.authorizationUrl); return; }
    setPhase("pending");
  }

  async function simulate(outcome: "successful" | "failed") {
    if (!booking) return;
    setPhase("verifying");
    await simulatePayment(booking.reference, outcome);
    const v = unwrap(await paymentService.verify(booking.reference));
    if (!v) return;
    if (v.paymentStatus === "successful") router.push(`/booking/confirmation?ref=${v.reference}`);
    else setPhase("failed");
  }

  const busy = phase === "working" || phase === "verifying";
  return (
    <div className="space-y-8">
      <section aria-labelledby="g-h" className="border border-black/10 bg-white p-6">
        <div className="flex items-start justify-between gap-4"><h2 id="g-h" className="font-serif text-2xl">Guest</h2><Link href={guestHref} className="text-sm underline underline-offset-4 hover:text-gold">Edit</Link></div>
        <p className="mt-3 font-medium">{guest.fullName}</p>
        <p className="text-sm text-muted">{guest.email} · {guest.phone}</p>
        {guest.requests && <p className="mt-3 text-sm"><span className="text-muted">Requests: </span>{guest.requests}</p>}
      </section>

      <section aria-labelledby="m-h">
        <h2 id="m-h" className="mb-3 font-serif text-2xl">Payment method</h2>
        {paymentMethods.filter((m) => m.enabled).map((m) => (
          <label key={m.id} className="flex items-start gap-3 border border-gold bg-white p-4">
            <input type="radio" name="method" defaultChecked className="mt-1 accent-[#c9a348]" />
            <span><span className="block font-medium">{m.label}</span><span className="text-sm text-muted">{m.note}</span></span>
          </label>
        ))}
      </section>

      <div aria-live="polite" className="space-y-3">
        {phase === "pending" && <div className={`${banner} border-amber-500 bg-amber-50`}><Clock size={18} className="mt-0.5 shrink-0" /><p><b>Payment pending.</b> Booking {booking?.reference} is not confirmed until payment is verified.</p></div>}
        {phase === "verifying" && <div className={`${banner} border-gold bg-cream`}><Clock size={18} className="mt-0.5 shrink-0" /><p>Verifying your payment…</p></div>}
        {phase === "failed" && <div role="alert" className={`${banner} border-red-600 bg-red-50`}><XCircle size={18} className="mt-0.5 shrink-0 text-red-700" /><p><b>Payment failed.</b> You haven’t been charged for a confirmed booking. You can try again.</p></div>}
        {phase === "error" && <div role="alert" className={`${banner} border-red-600 bg-red-50`}><CircleAlert size={18} className="mt-0.5 shrink-0 text-red-700" /><p>{message}</p></div>}
      </div>

      {paymentMode === "mock" && phase === "pending" && (
        <div className="border border-dashed border-black/30 p-5">
          <p className="flex items-center gap-2 font-medium"><FlaskConical size={18} className="text-gold" />Test mode</p>
          <p className="mb-4 mt-1 text-sm text-muted">No payment gateway is connected, so no money moves. Choose a result to see how the next step behaves.</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => simulate("successful")} className="min-h-11 bg-black px-5 text-sm font-semibold text-white hover:bg-charcoal">Simulate successful payment</button>
            <button type="button" onClick={() => simulate("failed")} className="min-h-11 border border-black/30 px-5 text-sm font-semibold hover:border-gold">Simulate failed payment</button>
          </div>
        </div>
      )}

      {phase !== "pending" && (
        <div>
          <button type="button" onClick={pay} disabled={busy || total === null} className="min-h-12 bg-gold px-8 font-semibold text-black transition-colors hover:bg-champagne disabled:opacity-50">
            {busy ? "Please wait…" : phase === "failed" || phase === "error" ? "Try payment again" : total !== null ? `Pay ${fmt(total)}` : "Pay now"}
          </button>
          {total === null && <p className="mt-3 text-sm text-muted">Payment can start once the hotel has set a price for this room.</p>}
        </div>
      )}
    </div>
  );
}