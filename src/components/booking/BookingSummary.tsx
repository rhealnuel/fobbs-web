import SiteImage from "@/components/common/SiteImage";
import { imageFor } from "@/config/images";
import { policies } from "@/config/booking";
import { calcPrice, fmt, nightsBetween } from "@/lib/pricing";
import type { Accommodation } from "@/types/accommodation";
import type { BookingQuery } from "@/types/booking";

const day = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** Server component, reused on the guest-details, payment and confirmation steps. */
export default function BookingSummary({ a, q }: { a: Accommodation; q: BookingQuery }) {
  const nights = nightsBetween(q.checkIn, q.checkOut);
  const price = a.pricePerNight ? calcPrice(a.pricePerNight, nights) : null;
  const guests = `${q.adults} ${q.adults === 1 ? "adult" : "adults"}${q.children ? `, ${q.children} ${q.children === 1 ? "child" : "children"}` : ""}`;
  const row = "flex justify-between gap-4";
  return (
    <aside aria-label="Booking summary" className="border-t-2 border-gold bg-white shadow-[0_18px_40px_rgba(0,0,0,.08)] lg:sticky lg:top-24">
      <SiteImage spec={imageFor(a.photos[0], a.name, "16/9", `${a.name}: main photo. 1800x1350`)} sizes="400px" />
      <div className="p-6">
        <p className="text-sm text-gold">{a.type}</p>
        <h2 className="font-serif text-2xl">{a.name}</h2>
        <dl className="mt-5 space-y-2 border-t border-black/10 pt-4 text-sm">
          <div className={row}><dt className="text-muted">Check-in</dt><dd className="text-right">{day(q.checkIn)}{policies.checkIn && <span className="block text-xs text-muted">{policies.checkIn}</span>}</dd></div>
          <div className={row}><dt className="text-muted">Check-out</dt><dd className="text-right">{day(q.checkOut)}{policies.checkOut && <span className="block text-xs text-muted">{policies.checkOut}</span>}</dd></div>
          <div className={row}><dt className="text-muted">Nights</dt><dd>{nights}</dd></div>
          <div className={row}><dt className="text-muted">Guests</dt><dd className="text-right">{guests}</dd></div>
        </dl>
        <dl className="mt-4 space-y-2 border-t border-black/10 pt-4 text-sm">
          {price && a.pricePerNight ? (
            <>
              <div className={row}><dt className="text-muted">{fmt(a.pricePerNight)} x {nights} {nights === 1 ? "night" : "nights"}</dt><dd>{fmt(price.subtotal)}</dd></div>
              {price.lines.map((l) => <div key={l.label} className={row}><dt className="text-muted">{l.label}</dt><dd>{fmt(l.amount)}</dd></div>)}
            </>
          ) : <div className={row}><dt className="text-muted">Price per night</dt><dd>To be configured</dd></div>}
          <div className={`${row} border-t border-black/10 pt-3 text-base font-semibold`}><dt>Total</dt><dd>{price ? fmt(price.total) : "To be confirmed"}</dd></div>
        </dl>
      </div>
    </aside>
  );
}