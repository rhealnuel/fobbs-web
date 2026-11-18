import type { Metadata } from "next";
import Link from "next/link";
import GalleryBrowser from "@/components/gallery/GalleryBrowser";
import Reveal from "@/components/common/Reveal";
import SiteImage from "@/components/common/SiteImage";
import SlowZoom from "@/components/common/SlowZoom";
import { images, imageFor } from "@/config/images";
import { gallery } from "@/data/gallery";

export const metadata: Metadata = { title: "Gallery", description: "Photographs of FOBBS rooms, serviced apartments and facilities." };

export default function GalleryPage() {
  const spec = (g: (typeof gallery)[number]) => imageFor(g.file, `${g.label} at FOBBS`, g.ratio, `${g.label}. ${g.ratio.replace("/", ":")}, ${g.size}`);
  const thumbs = Object.fromEntries(gallery.map((g) => [g.id, <SiteImage key={g.id} spec={spec(g)} sizes="(min-width:1024px) 33vw, 50vw" />]));
  const full = Object.fromEntries(gallery.map((g) => [g.id, <SiteImage key={g.id} spec={spec(g)} sizes="1100px" />]));
  return (
    <>
      <section className="relative flex min-h-[46svh] items-end overflow-hidden bg-black pb-12 pt-32 text-white">
        <SlowZoom><SiteImage spec={images.bannerGallery} fill priority sizes="100vw" /></SlowZoom>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/55" />
        <div className="relative mx-auto w-[min(1240px,100%-2.5rem)]">
          <Reveal delay={0.15}><span className="mb-3 block text-sm tracking-wide text-champagne">Gallery</span></Reveal>
          <Reveal delay={0.3}><h1 className="font-serif text-4xl md:text-6xl">A look inside FOBBS.</h1></Reveal>
          <Reveal delay={0.45}><p className="mt-4 max-w-[52ch] text-[#e7e2d4]">Rooms, serviced apartments and the spaces you’ll share. Choose a category, or open any photo to see it larger.</p></Reveal>
        </div>
      </section>
      <GalleryBrowser items={gallery.map(({ id, label, category, ratio }) => ({ id, label, category, ratio }))} thumbs={thumbs} full={full} />
      <section className="bg-cream py-16 text-center">
        <Reveal className="mx-auto w-[min(1240px,100%-2.5rem)]">
          <h2 className="font-serif text-3xl md:text-4xl">Like what you see?</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/accommodations" className="bg-black px-6 py-3.5 font-semibold text-white transition-colors hover:bg-charcoal">Explore Accommodation</Link>
            <Link href="/book" className="bg-gold px-6 py-3.5 font-semibold text-black transition-colors hover:bg-champagne">Book Your Stay</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}