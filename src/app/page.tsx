import Link from "next/link";
import { ArrowUpRight, BedDouble, CalendarCheck, Search as SearchIcon, Users } from "lucide-react";
import SiteImage from "@/components/common/SiteImage";
import Reveal from "@/components/common/Reveal";
import SlowZoom from "@/components/common/SlowZoom";
import SearchPanel from "@/components/homepage/SearchPanel";
import { accommodations } from "@/data/accommodations";
import { images, imageFor } from "@/config/images";
import type { Accommodation } from "@/types/accommodation";

const wrap = "mx-auto w-[min(1240px,100%-2.5rem)]";
const zoom = "absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-105";
const eyebrow = "mb-4 block text-sm tracking-wide text-gold";
const btnGold = "inline-block bg-gold px-6 py-3.5 font-semibold text-black transition-colors hover:bg-champagne";
const btnGhost = "inline-block border border-current px-6 py-3.5 font-semibold transition-colors hover:bg-white/10";

const gallery = [
  { f: "gallery/gallery-01.jpg", a: "Bedroom", c: "row-span-2" },
  { f: "gallery/gallery-02.jpg", a: "Apartment interior", c: "col-span-2" },
  { f: "gallery/gallery-03.jpg", a: "Exterior", c: "" },
  { f: "gallery/gallery-04.jpg", a: "Reception", c: "" },
  { f: "gallery/gallery-05.jpg", a: "Lounge", c: "row-span-2" },
  { f: "gallery/gallery-06.jpg", a: "Bathroom", c: "" },
  { f: "gallery/gallery-07.jpg", a: "Dining", c: "col-span-2" },
];

function AccCard({ a, i, className, ratio }: { a: Accommodation; i: number; className: string; ratio: string }) {
  const spec = imageFor(a.photos[0], a.name, ratio, `${a.name}: main photo`);
  return (
    <Reveal delay={(i % 3) * 0.08} className={className}>
      <article className="group relative h-full overflow-hidden bg-charcoal" style={{ aspectRatio: ratio }}>
        <div className={zoom}><SiteImage spec={spec} fill sizes="(min-width:1024px) 40vw, 100vw" /></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <p className="text-sm text-champagne">{a.type}</p>
          <h3 className="mt-1 font-serif text-2xl md:text-3xl">
            <Link href={`/accommodations/${a.slug}`} className="after:absolute after:inset-0">{a.name}</Link>
          </h3>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 text-sm text-white/80">
            <span className="flex items-center gap-1.5"><Users size={15} />Up to {a.maxGuests}</span>
            <span className="flex items-center gap-1.5"><BedDouble size={15} />{a.beds ?? "Beds to be confirmed"}</span>
            <span>{a.pricePerNight ? `₦${a.pricePerNight.toLocaleString()} per night` : "Price to be configured"}</span>
          </p>
          <div className="relative z-10 mt-4 flex gap-5 text-sm font-semibold">
            <Link href={`/accommodations/${a.slug}`} className="border-b border-gold pb-0.5">View Details</Link>
            <Link href={`/book?type=${a.slug}`} className="border-b border-transparent pb-0.5 text-champagne hover:border-champagne">Book Now</Link>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[92svh] items-end overflow-hidden bg-black pb-40 text-white md:pb-44">
        <SlowZoom><SiteImage spec={images.heroMain} fill priority sizes="100vw" /></SlowZoom>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/55" />
        <div className={`${wrap} relative`}>
          <Reveal delay={0.2}><span className="mb-4 block text-sm tracking-wide text-champagne">Welcome to FOBBS</span></Reveal>
          <Reveal delay={0.35}><h1 className="max-w-[12ch] font-serif text-5xl leading-[1.02] md:text-7xl lg:text-8xl">Your Comfort, Our Priority.</h1></Reveal>
          <Reveal delay={0.5}><p className="mt-6 max-w-[46ch] text-lg text-[#e7e2d4]">FOBBS Apartment and Suites offers hotel rooms and serviced apartments, with a simple way to reserve your stay.</p></Reveal>
          <Reveal delay={0.65} className="mt-8 flex flex-wrap gap-3">
            <Link href="/accommodations" className={btnGold}>Explore Accommodation</Link>
            <Link href="/book" className={btnGhost}>Book Your Stay</Link>
          </Reveal>
        </div>
      </section>

      {/* Search */}
      <div className="relative z-10 -mt-24 md:-mt-28"><div className={wrap}><Reveal y={40}><SearchPanel /></Reveal></div></div>

      {/* Introduction */}
      <section className="py-24 md:py-32">
        <div className={`${wrap} grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-24`}>
          <Reveal className="relative pb-12 pr-12 lg:pb-16 lg:pr-16">
            <SiteImage spec={images.exterior} sizes="(min-width:1024px) 50vw, 100vw" />
            <div className="absolute bottom-0 right-0 w-[45%] border-[6px] border-warm"><SiteImage spec={images.reception} sizes="25vw" /></div>
          </Reveal>
          <Reveal delay={0.1}>
            <span className={eyebrow}>About FOBBS</span>
            <h2 className="font-serif text-4xl leading-tight md:text-5xl">Experience comfort beyond expectations.</h2>
            <p className="my-6 max-w-[52ch] text-muted">FOBBS Apartment and Suites combines traditional hotel rooms with serviced apartments, so you can choose the kind of stay that suits you. [Replace with the hotel’s own introduction.]</p>
            <ul className="mb-8 border-t border-black/10">
              {["Hotel rooms and serviced apartments in one property", "Reserve online and receive a booking reference", "Highlights to be confirmed by the hotel"].map((t) => <li key={t} className="border-b border-black/10 py-3">{t}</li>)}
            </ul>
            <Link href="/about" className="inline-block bg-black px-6 py-3.5 font-semibold text-white transition-colors hover:bg-charcoal">Explore More</Link>
          </Reveal>
        </div>
      </section>

      {/* Accommodation */}
      <section className="bg-cream py-24 md:py-32">
        <div className={wrap}>
          <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div><span className={eyebrow}>Accommodation</span><h2 className="font-serif text-4xl md:text-5xl">Find the room that fits.</h2></div>
            <Link href="/accommodations" className="flex items-center gap-1 border-b border-gold pb-0.5 font-semibold">View all <ArrowUpRight size={16} /></Link>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            {accommodations.map((a, i) => <AccCard key={a.slug} a={a} i={i} ratio={i < 2 ? "4/3" : "4/5"} className={i < 2 ? "lg:col-span-3" : "lg:col-span-2"} />)}
          </div>
          <p className="mt-6 text-sm text-muted">Categories, capacity and prices are sample data until the hotel confirms its inventory.</p>
        </div>
      </section>

      {/* Apartments */}
      <section className="bg-black py-24 text-[#f2efe8] md:py-32">
        <div className={wrap}>
          <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div><span className={eyebrow}>Serviced apartments</span><h2 className="font-serif text-4xl md:text-5xl">Space to live, not just stay.</h2></div>
            <Link href="/accommodations?type=apartment" className={btnGold}>Explore All Apartments</Link>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-12">
            {[
              { s: images.apartmentLiving, c: "md:col-span-7", l: "Living room" },
              { s: images.apartmentBedroom, c: "md:col-span-5", l: "Bedroom" },
              { s: images.apartmentKitchen, c: "md:col-span-4", l: "Kitchen, if available" },
              { s: images.apartmentDetail, c: "md:col-span-8", l: "Interior details" },
            ].map((x, i) => (
              <Reveal key={x.l} delay={(i % 2) * 0.1} className={x.c}>
                <figure className="group"><div className="relative overflow-hidden"><div className="transition-transform duration-[900ms] ease-out group-hover:scale-105"><SiteImage spec={x.s} sizes="(min-width:768px) 60vw, 100vw" /></div></div>
                  <figcaption className="mt-2 text-sm text-[#b9b2a0]">{x.l}</figcaption></figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why + facilities */}
      <section className="py-24 md:py-32">
        <div className={wrap}>
          <Reveal className="mb-12"><span className={eyebrow}>Why FOBBS</span><h2 className="max-w-[18ch] font-serif text-4xl md:text-5xl">Booking a stay, made simple.</h2></Reveal>
          <div className="grid border-t border-black/10 md:grid-cols-3">
            {[[SearchIcon, "Choose your kind of stay", "Hotel rooms or serviced apartments, side by side."], [CalendarCheck, "Reserve online", "Pick dates, guests and a room, then confirm."], [ArrowUpRight, "Find your booking again", "Look up a reservation with its reference."]].map(([Icon, t, d], i) => {
              const I = Icon as typeof SearchIcon;
              return <Reveal key={t as string} delay={i * 0.1} className="border-b border-black/10 py-8 md:pr-8"><I className="mb-4 text-gold" size={22} /><h3 className="font-serif text-xl">{t as string}</h3><p className="mt-2 text-muted">{d as string}</p></Reveal>;
            })}
          </div>
          <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[[images.reception, "Reception"], [images.lounge, "Lounge"], [images.dining, "Dining"], [images.parking, "Parking and security"]].map(([s, l], i) => (
              <Reveal key={l as string} delay={i * 0.08}>
                <figure className="group"><div className="overflow-hidden"><div className="transition-transform duration-[900ms] ease-out group-hover:scale-105"><SiteImage spec={s as typeof images.lounge} sizes="(min-width:1024px) 25vw, 50vw" /></div></div><figcaption className="py-2">{l as string}</figcaption></figure>
              </Reveal>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted">Facilities appear here only once the hotel confirms them.</p>
        </div>
      </section>

      {/* Gallery preview */}
      <section className="bg-cream py-24 md:py-32">
        <div className={wrap}>
          <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div><span className={eyebrow}>Gallery</span><h2 className="font-serif text-4xl md:text-5xl">A look inside.</h2></div>
            <Link href="/gallery" className="bg-black px-6 py-3.5 font-semibold text-white transition-colors hover:bg-charcoal">View Full Gallery</Link>
          </Reveal>
          <div className="grid auto-rows-[130px] grid-cols-2 gap-3 md:auto-rows-[170px] md:grid-cols-4">
            {gallery.map((g, i) => (
              <Reveal key={g.f} delay={(i % 4) * 0.06} className={g.c}>
                <Link href="/gallery" aria-label={`Open gallery: ${g.a}`} className="group relative block h-full overflow-hidden">
                  <div className={zoom}><SiteImage spec={imageFor(g.f, g.a, "1/1", g.a)} fill sizes="(min-width:768px) 25vw, 50vw" /></div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="relative overflow-hidden bg-black py-32 text-white md:py-44">
        <SiteImage spec={images.heroSecondary} fill sizes="100vw" />
        <div className="absolute inset-0 bg-black/60" />
        <div className={`${wrap} relative`}>
          <Reveal className="max-w-[640px]">
            <span className="mb-4 block text-sm tracking-wide text-champagne">The guest experience</span>
            <h2 className="font-serif text-4xl md:text-6xl">Arrive, settle in, feel at home.</h2>
            <p className="my-6 text-[#e4dfd0]">[Replace with the hotel’s own description of the guest experience.]</p>
            <Link href="/book" className={btnGold}>Book Your Stay</Link>
          </Reveal>
        </div>
      </section>

      {/* Final call to action */}
      <section className="py-24 text-center md:py-32">
        <Reveal className={wrap}>
          <h2 className="font-serif text-4xl md:text-6xl">Your next stay starts here.</h2>
          <p className="mx-auto my-5 max-w-[44ch] text-muted">Discover comfortable accommodation and make your reservation with ease.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/accommodations" className="bg-black px-6 py-3.5 font-semibold text-white transition-colors hover:bg-charcoal">Explore Accommodation</Link>
            <Link href="/book" className={btnGold}>Book Your Stay</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}