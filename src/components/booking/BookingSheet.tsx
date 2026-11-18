import Image from "next/image";
import { getAccommodation } from "@/data/accommodations";
import { site } from "@/config/site";
import { fmt, nightsBetween } from "@/lib/pricing";
import type { Booking } from "@/services/payment";

const day = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const tbs = (v: string | null) => v ?? "To be supplied";
const row = "flex justify-between gap-6 border-b border-black/10 py-3";

/** The printable booking sheet. Shared by the confirmation and lookup pages. */
export default function BookingSheet({ b }: { b: Booking }) {
  const a = getAccommodation(b.slug);
  const nights = nightsBetween(b.checkIn, b.checkOut);
  const paid = b.paymentStatus === "successful";
  const failed = b.paymentStatus === "failed";
  return (
    <article aria-label="Booking details" className="mt-8 border border-black/10 bg-white shadow-[0_18px_40px_rgba(0,0,0,.08)] print:mt-0 print:shadow-none">
        <div className="flex items-center justify-between gap-4 bg-black px-6 py-4 print:bg-white print:px-0">
          <Image src="/images/logo/fobbs-logo-light.png" alt="FOBBS Apartment and Suites" width={1000} height={860} className="h-14 w-auto print:hidden" />
          <p className="hidden font-serif text-2xl print:block">FOBBS Apartment and Suites</p>
          <div className="text-right text-white print:text-black"><p className="text-xs text-white/60 print:text-black/60">Booking reference</p><p className="font-mono text-xl tracking-wider text-champagne print:text-black">{b.reference}</p></div>
        </div>
        <div className="p-6 md:p-8">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-serif text-2xl">{a?.name ?? b.slug}</h3>
            <span className={`px-3 py-1 text-xs font-medium ${paid ? "bg-gold/20" : failed ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-900"}`}>{paid ? "Payment successful" : failed ? "Payment failed" : "Payment pending"}</span>
          </div>
          <p className="text-sm text-muted">{a?.type}</p>
          <dl className="mt-4 border-t border-black/10 text-sm">
            <div className={row}><dt className="text-muted">Guest</dt><dd className="text-right">{b.guest.fullName}<span className="block text-xs text-muted">{b.guest.email} · {b.guest.phone}</span></dd></div>
            <div className={row}><dt className="text-muted">Check-in</dt><dd>{day(b.checkIn)}</dd></div>
            <div className={row}><dt className="text-muted">Check-out</dt><dd>{day(b.checkOut)}</dd></div>
            <div className={row}><dt className="text-muted">Nights</dt><dd>{nights}</dd></div>
            <div className={row}><dt className="text-muted">Guests</dt><dd>{b.adults} {b.adults === 1 ? "adult" : "adults"}{b.children ? `, ${b.children} ${b.children === 1 ? "child" : "children"}` : ""}</dd></div>
            <div className={`${row} text-base font-semibold`}><dt>Total</dt><dd>{b.total !== null ? fmt(b.total) : "To be confirmed"}</dd></div>
          </dl>
          <div className="mt-6 text-sm"><p className="mb-1 font-medium">Contact the hotel</p><p className="text-muted">Phone: {tbs(site.contact.phone)} · Email: {tbs(site.contact.email)} · WhatsApp: {tbs(site.contact.whatsapp)}<br />Address: {tbs(site.contact.address)}</p></div>
        </div>
      </article>
  );
}