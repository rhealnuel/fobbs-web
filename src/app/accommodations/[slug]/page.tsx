import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BedDouble, Check, ChevronRight, Maximize2, ShowerHead, Users } from "lucide-react";
import SiteImage from "@/components/common/SiteImage";
import Reveal from "@/components/common/Reveal";
import PhotoGallery from "@/components/accommodation/PhotoGallery";
import BookingPanel from "@/components/accommodation/BookingPanel";
import AccommodationCard from "@/components/accommodation/AccommodationCard";
import { accommodations, getAccommodation } from "@/data/accommodations";
import { imageFor } from "@/config/images";
import { policies } from "@/config/booking";

type Props = { params: Promise<{ slug: string }> };

const roomNotes = ["Whole room, bed in view", "Second angle", "Bathroom", "Desk, TV or window"];
const aptNotes = ["Living area and bedroom overview", "Bedroom", "Kitchen", "Bathroom"];
const tbc = "To be confirmed";

export const generateStaticParams = () => accommodations.map((a) => ({ slug: a.slug }));
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = getAccommodation((await params).slug);
  return a ? { title: a.name, description: a.description } : { title: "Accommodation" };
}

function DetailSkeleton() {
  return (
    <div className="mx-auto w-[min(1240px,100%-2.5rem)] pb-20 pt-28" aria-hidden>
      <div className="h-4 w-56 animate-pulse bg-cream" />
      <div className="mt-6 h-14 w-2/3 animate-pulse bg-cream" />
      <div className="mt-8 aspect-[16/7] animate-pulse bg-cream" />
    </div>
  );
}

// Reading params must happen inside Suspense (Next.js 16), so the page is a thin wrapper.
export default function Page({ params }: Props) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <Detail params={params} />
    </Suspense>
  );
}

async function Detail({ params }: Props) {
  const a = getAccommodation((await params).slug);
  if (!a) notFound();

  const notes = a.type === "Hotel room" ? roomNotes : aptNotes;
  const labels = a.photos.map((_, i) => `${a.name}: ${notes[i] ?? "photo"}`);
  const spec = (f: string, i: number, ratio: string) => imageFor(f, labels[i], ratio, `${labels[i]}. 1800x1350`);
  const thumbs = a.photos.map((f, i) => <SiteImage key={f} spec={spec(f, i, "4/3")} fill sizes="(min-width:768px) 50vw, 85vw" priority={i === 0} />);
  const full = a.photos.map((f, i) => <SiteImage key={f} spec={spec(f, i, "3/2")} sizes="960px" />);
  const similar = [...accommodations.filter((x) => x.slug !== a.slug && x.type === a.type), ...accommodations.filter((x) => x.slug !== a.slug && x.type !== a.type)].slice(0, 3);

  const facts = [
    { Icon: Users, k: "Sleeps", v: `Up to ${a.maxGuests} guests` },
    { Icon: BedDouble, k: "Beds", v: a.beds ?? tbc },
    { Icon: Maximize2, k: "Size", v: a.sizeSqm ? `${a.sizeSqm} m²` : tbc },
    { Icon: ShowerHead, k: "Bathroom", v: a.bathroom ?? tbc },
  ];
  const rules = [["Check-in", policies.checkIn], ["Check-out", policies.checkOut], ["Cancellation", policies.cancellation], ["Payment", policies.payment]] as const;

  return (
    <div className="pb-20 lg:pb-0">
      <div className="mx-auto w-[min(1240px,100%-2.5rem)] pt-28">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted">
          <Link href="/" className="hover:text-ink">Home</Link><ChevronRight size={14} />
          <Link href="/accommodations" className="hover:text-ink">Accommodations</Link><ChevronRight size={14} />
          <span aria-current="page" className="text-ink">{a.name}</span>
        </nav>
        <Reveal className="mb-8 mt-6">
          <span className="mb-2 block text-sm tracking-wide text-gold">{a.type}</span>
          <h1 className="font-serif text-4xl md:text-6xl">{a.name}</h1>
          <p className="mt-3 max-w-[56ch] text-lg text-muted">{a.description}</p>
        </Reveal>
        <Reveal y={16}><PhotoGallery thumbs={thumbs} full={full} labels={labels} /></Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
          <div>
            <Reveal><h2 className="font-serif text-3xl">About this {a.type.toLowerCase()}</h2>
              <p className="mt-4 max-w-[62ch] text-muted">{a.description} [Replace with the hotel’s full description.]</p></Reveal>
            <Reveal className="mt-10"><dl className="grid grid-cols-2 gap-px border border-black/10 bg-black/10 md:grid-cols-4">
              {facts.map(({ Icon, k, v }) => <div key={k} className="bg-warm p-4"><Icon size={18} className="mb-2 text-gold" /><dt className="text-xs text-muted">{k}</dt><dd className="mt-0.5 text-sm font-medium">{v}</dd></div>)}
            </dl></Reveal>
            <Reveal className="mt-12"><h2 className="font-serif text-2xl">Amenities</h2>
              {a.amenities.length ? <ul className="mt-4 grid gap-2 sm:grid-cols-2">{a.amenities.map((x) => <li key={x} className="flex items-center gap-2"><Check size={16} className="text-gold" />{x}</li>)}</ul>
                : <p className="mt-3 text-muted">Amenities will be listed once the hotel confirms them.</p>}</Reveal>
            <Reveal className="mt-12"><h2 className="font-serif text-2xl">Policies</h2>
              <dl className="mt-4 border-t border-black/10">{rules.map(([k, v]) => <div key={k} className="flex justify-between gap-6 border-b border-black/10 py-3"><dt className="text-muted">{k}</dt><dd className="text-right">{v ?? tbc}</dd></div>)}</dl></Reveal>
          </div>
          <Suspense fallback={<div className="h-96 animate-pulse bg-cream" aria-hidden />}>
            <BookingPanel slug={a.slug} name={a.name} rate={a.pricePerNight} maxGuests={a.maxGuests} />
          </Suspense>
        </div>
      </div>

      <section className="mt-24 bg-cream py-20">
        <div className="mx-auto w-[min(1240px,100%-2.5rem)]">
          <Reveal className="mb-10"><h2 className="font-serif text-3xl md:text-4xl">You may also like</h2></Reveal>
          <ul className="grid gap-x-6 gap-y-12 md:grid-cols-3">{similar.map((s) => <li key={s.slug}><AccommodationCard a={s} /></li>)}</ul>
        </div>
      </section>
    </div>
  );
}