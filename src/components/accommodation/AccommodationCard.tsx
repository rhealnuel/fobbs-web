import Link from "next/link";
import { BedDouble, Users } from "lucide-react";
import SiteImage from "@/components/common/SiteImage";
import { imageFor } from "@/config/images";
import type { Accommodation } from "@/types/accommodation";

/** Server component: renders the photo so SiteImage can check public/images. */
export default function AccommodationCard({ a }: { a: Accommodation }) {
  const spec = imageFor(a.photos[0], a.name, "4/3", `${a.name}: main photo. 1800x1350`);
  return (
    <article className="group">
      <Link href={`/accommodations/${a.slug}`} aria-label={`View ${a.name}`} className="relative block overflow-hidden">
        <div className="transition-transform duration-[900ms] ease-out group-hover:scale-105">
          <SiteImage spec={spec} sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw" />
        </div>
        <span className="absolute left-3 top-3 bg-black/80 px-3 py-1 text-xs text-champagne">{a.type}</span>
      </Link>
      <div className="border-b border-black/10 pb-6 pt-5">
        <h2 className="font-serif text-2xl md:text-3xl">{a.name}</h2>
        <p className="mt-2 text-muted">{a.description}</p>
        <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
          <span className="flex items-center gap-1.5"><Users size={15} className="text-gold" />Up to {a.maxGuests} guests</span>
          <span className="flex items-center gap-1.5"><BedDouble size={15} className="text-gold" />{a.beds ?? "Beds to be confirmed"}</span>
        </p>
        <p className="mt-3 flex items-baseline justify-between gap-4">
          <span className="font-serif text-xl">{a.pricePerNight ? `₦${a.pricePerNight.toLocaleString()}` : "Price to be configured"}{a.pricePerNight && <span className="font-sans text-sm text-muted"> per night</span>}</span>
          <span className="text-xs text-muted">Availability confirmed when you book</span>
        </p>
        <div className="mt-5 flex gap-3 text-sm font-semibold">
          <Link href={`/accommodations/${a.slug}`} className="border border-black/20 px-5 py-3 transition-colors hover:border-gold">View Details</Link>
          <Link href={`/book?type=${a.slug}`} className="bg-gold px-5 py-3 text-black transition-colors hover:bg-champagne">Book Now</Link>
        </div>
      </div>
    </article>
  );
}