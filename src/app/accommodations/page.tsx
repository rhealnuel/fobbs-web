import type { Metadata } from "next";
import { Suspense } from "react";
import SiteImage from "@/components/common/SiteImage";
import SlowZoom from "@/components/common/SlowZoom";
import Reveal from "@/components/common/Reveal";
import AccommodationCard from "@/components/accommodation/AccommodationCard";
import AccommodationBrowser from "@/components/accommodation/AccommodationBrowser";
import { accommodations } from "@/data/accommodations";
import { images } from "@/config/images";

export const metadata: Metadata = {
  title: "Accommodations",
  description: "Browse FOBBS hotel rooms and serviced apartments.",
};

function Skeleton() {
  return (
    <div className="mx-auto grid w-[min(1240px,100%-2.5rem)] gap-6 py-16 md:grid-cols-2 xl:grid-cols-3" aria-hidden>
      {[0, 1, 2].map((i) => <div key={i} className="aspect-[4/3] animate-pulse bg-cream" />)}
    </div>
  );
}

export default function AccommodationsPage() {
  const cards = Object.fromEntries(accommodations.map((a) => [a.slug, <AccommodationCard key={a.slug} a={a} />]));
  return (
    <>
      <section className="relative flex min-h-[46svh] items-end overflow-hidden bg-black pb-12 pt-32 text-white">
        <SlowZoom><SiteImage spec={images.bannerAccommodation} fill priority sizes="100vw" /></SlowZoom>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/55" />
        <div className="relative mx-auto w-[min(1240px,100%-2.5rem)]">
          <Reveal delay={0.15}><span className="mb-3 block text-sm tracking-wide text-champagne">Accommodations</span></Reveal>
          <Reveal delay={0.3}><h1 className="font-serif text-4xl md:text-6xl">Rooms and serviced apartments.</h1></Reveal>
          <Reveal delay={0.45}><p className="mt-4 max-w-[52ch] text-[#e7e2d4]">Choose a hotel room for a short stay, or a serviced apartment when you want more space.</p></Reveal>
        </div>
      </section>
      <Suspense fallback={<Skeleton />}>
        <AccommodationBrowser items={accommodations} cards={cards} />
      </Suspense>
    </>
  );
}