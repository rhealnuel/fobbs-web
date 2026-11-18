import Link from "next/link";
import SiteImage from "@/components/common/SiteImage";
import { images } from "@/config/images";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden bg-black pb-16 pt-32 text-white">
      <SiteImage spec={images.heroSecondary} fill sizes="100vw" />
      <div className="absolute inset-0 bg-black/75" />
      <div className="relative mx-auto w-[min(1240px,100%-2.5rem)]">
        <p className="font-serif text-8xl text-gold md:text-9xl" aria-hidden>404</p>
        <h1 className="mt-2 font-serif text-4xl md:text-5xl">We can’t find that page.</h1>
        <p className="mt-4 max-w-[46ch] text-[#d8d2c2]">The page may have moved, or the address may have a typo. Here are some places to go instead.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="bg-gold px-6 py-3.5 font-semibold text-black transition-colors hover:bg-champagne">Back to Home</Link>
          <Link href="/accommodations" className="border border-white/70 px-6 py-3.5 font-semibold transition-colors hover:bg-white/10">Explore Accommodation</Link>
          <Link href="/booking/lookup" className="border border-white/70 px-6 py-3.5 font-semibold transition-colors hover:bg-white/10">Find my booking</Link>
        </div>
      </div>
    </section>
  );
}