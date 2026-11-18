import Link from "next/link";
import { BedDouble, Users } from "lucide-react";
import SiteImage from "@/components/common/SiteImage";
import { imageFor } from "@/config/images";
import { fmt } from "@/lib/pricing";
import { queryString } from "@/lib/bookng"; 
import type { AvailabilityResult, BookingQuery } from "@/types/booking";

export default function ResultCard({ r, q }: { r: AvailabilityResult; q: BookingQuery }) {
  const a = r.accommodation;
  const ok = r.availability === "available";
  const spec = imageFor(a.photos[0], a.name, "4/3", `${a.name}: main photo. 1800x1350`);
  return (
    <article className={`grid border border-black/10 bg-white md:grid-cols-[5fr_7fr] ${ok ? "" : "opacity-60"}`}>
      <Link href={`/accommodations/${a.slug}`} aria-label={`View ${a.name}`} className="group relative block overflow-hidden">
        <div className="transition-transform duration-[900ms] ease-out group-hover:scale-105"><SiteImage spec={spec} sizes="(min-width:768px) 40vw, 100vw" /></div>
      </Link>
      <div className="flex flex-col justify-between gap-6 p-6">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-sm text-gold">{a.type}</p><h2 className="font-serif text-2xl md:text-3xl">{a.name}</h2></div>
            <span className={`shrink-0 px-3 py-1 text-xs ${ok ? "bg-gold/15 text-black" : "bg-black/10 text-muted"}`}>{ok ? "Available" : "Not available"}</span>
          </div>
          <p className="mt-2 text-muted">{a.description}</p>
          <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
            <span className="flex items-center gap-1.5"><Users size={15} className="text-gold" />Up to {a.maxGuests} guests</span>
            <span className="flex items-center gap-1.5"><BedDouble size={15} className="text-gold" />{a.beds ?? "Beds to be confirmed"}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-black/10 pt-4">
          <div>
            <p className="font-serif text-xl">{a.pricePerNight ? <>{fmt(a.pricePerNight)}<span className="font-sans text-sm text-muted"> per night</span></> : "Price to be configured"}</p>
            <p className="text-sm text-muted">{r.total ? `${fmt(r.total)} for ${r.nights} ${r.nights === 1 ? "night" : "nights"}` : `${r.nights} ${r.nights === 1 ? "night" : "nights"}`}{!ok && r.reason ? ` · ${r.reason}` : ""}</p>
          </div>
          {ok
            ? <Link href={`/book/guest-details?${queryString(q, { slug: a.slug })}`} className="bg-gold px-6 py-3 font-semibold text-black transition-colors hover:bg-champagne">Select</Link>
            : <span className="px-6 py-3 text-sm text-muted">Can’t select</span>}
        </div>
      </div>
    </article>
  );
}