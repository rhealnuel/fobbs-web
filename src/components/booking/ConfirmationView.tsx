"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Clock, FlaskConical, Printer, XCircle } from "lucide-react";
import BookingSheet from "./BookingSheet";
import { paymentService, type Booking } from "@/services/payment";

type State = { status: "loading" } | { status: "missing"; error: string } | { status: "ok"; booking: Booking };


export default function ConfirmationView({ reference }: { reference: string }) {
  const reduce = useReducedMotion();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let live = true;
    paymentService.get(reference).then((r) => { if (live) setState(r.ok ? { status: "ok", booking: r.data } : { status: "missing", error: r.error }); });
    return () => { live = false; };
  }, [reference]);

  if (state.status === "loading") return <div className="mx-auto h-96 w-[min(820px,100%-2.5rem)] animate-pulse bg-cream" aria-hidden />;
  if (state.status === "missing") {
    return (
      <div role="alert" className="mx-auto w-[min(520px,100%-2.5rem)] border border-black/10 bg-white p-10 text-center">
        <h2 className="font-serif text-2xl">We couldn’t find that booking</h2>
        <p className="mt-2 text-muted">{state.error} Check the reference, or look it up with your email or phone number.</p>
        <Link href="/booking/lookup" className="mt-6 inline-block bg-gold px-6 py-3 font-semibold text-black hover:bg-champagne">Find my booking</Link>
      </div>
    );
  }

  const b = state.booking;
  const paid = b.paymentStatus === "successful";
  const failed = b.paymentStatus === "failed";
  const payHref = `/book/payment?${new URLSearchParams({ checkIn: b.checkIn, checkOut: b.checkOut, adults: String(b.adults), children: String(b.children), slug: b.slug })}`;

  return (
    <div className="mx-auto w-[min(820px,100%-2.5rem)]">
      <div className="text-center print:hidden">
        <motion.div initial={reduce ? false : { scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={`mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full ${paid ? "bg-gold text-black" : failed ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"}`}>
          {paid ? <Check size={30} /> : failed ? <XCircle size={30} /> : <Clock size={30} />}
        </motion.div>
        <h2 className="font-serif text-3xl md:text-4xl">{paid ? "Your booking is confirmed" : failed ? "Payment didn’t go through" : "Payment pending"}</h2>
        <p className="mx-auto mt-3 max-w-[48ch] text-muted">
          {paid ? "Keep your booking reference. You’ll need it to find this reservation." : failed ? "This booking is not confirmed. You can try the payment again." : "This booking is not confirmed until payment is verified."}
        </p>
      </div>

      {b.mock && <p className="mt-8 flex items-start gap-2 border-l-2 border-gold bg-cream px-4 py-3 text-sm text-muted print:hidden"><FlaskConical size={16} className="mt-0.5 shrink-0 text-gold" />Test booking. No payment gateway is connected, so no money was taken and the hotel hasn’t received this reservation.</p>}

      <BookingSheet b={b} />

      <div className="mt-8 flex flex-wrap justify-center gap-3 print:hidden">
        {(failed || (!paid && !failed)) && <Link href={payHref} className="bg-gold px-6 py-3 font-semibold text-black hover:bg-champagne">{failed ? "Try payment again" : "Continue to payment"}</Link>}
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 border border-black/25 px-6 py-3 font-semibold hover:border-gold"><Printer size={16} />Print or save as PDF</button>
        <Link href={`/booking/lookup?ref=${b.reference}`} className="border border-black/25 px-6 py-3 font-semibold hover:border-gold">View booking details</Link>
        <Link href="/" className="bg-black px-6 py-3 font-semibold text-white hover:bg-charcoal">Return to homepage</Link>
      </div>
    </div>
  );
}