import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/common/Reveal";
import SiteImage from "@/components/common/SiteImage";
import SlowZoom from "@/components/common/SlowZoom";
import { about } from "@/config/about";
import { images, imageFor } from "@/config/images";
import { accommodations } from "@/data/accommodations";

export const metadata: Metadata = { title: "About FOBBS", description: "FOBBS Apartment and Suites offers hotel rooms and serviced apartments, with simple online booking." };

const wrap = "mx-auto w-[min(1240px,100%-2.5rem)]";
const eyebrow = "mb-4 block text-sm tracking-wide text-gold";
const todo = (t: string) => <span className="italic opacity-70">[{t}]</span>;
const zoom = "transition-transform duration-[900ms] ease-out group-hover:scale-105";

const expect = [
  ["Your choice of stay", "Hotel rooms for shorter visits, serviced apartments when you want more space."],
  ["Booking that’s simple", "Choose your dates and guests, see what fits, and reserve online."],
  ["A reference you can keep", "Every booking has a reference, so you can find or print your reservation later."],
];
const panels = [
  { type: "Hotel room" as const, title: "Hotel rooms", href: "/accommodations?type=room", spec: imageFor("rooms/standard-room-01.jpg", "A FOBBS hotel room", "4/5", "Hotel room, bed in view. 1600x2000") },
  { type: "Serviced apartment" as const, title: "Serviced apartments", href: "/accommodations?type=apartment", spec: imageFor("apartments/one-bedroom-apartment.jpg", "A FOBBS serviced apartment", "4/5", "Serviced apartment overview. 1600x2000") },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative flex min-h-[60svh] items-end overflow-hidden bg-black pb-14 pt-32 text-white">
        <SlowZoom><SiteImage spec={images.bannerAbout} fill priority sizes="100vw" /></SlowZoom>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/55" />
        <div className={`${wrap} relative`}>
          <Reveal delay={0.15}><span className="mb-3 block text-sm tracking-wide text-champagne">About FOBBS</span></Reveal>
          <Reveal delay={0.3}><h1 className="max-w-[16ch] font-serif text-5xl md:text-7xl">Hospitality, made comfortable.</h1></Reveal>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className={`${wrap} grid items-center gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-24`}>
          <Reveal><SiteImage spec={images.exterior} sizes="(min-width:1024px) 45vw, 100vw" /></Reveal>
          <Reveal delay={0.1}>
            <span className={eyebrow}>Welcome</span>
            <h2 className="font-serif text-4xl leading-tight md:text-5xl">Hotel rooms and serviced apartments, under one roof.</h2>
            <p className="mt-6 max-w-[54ch] text-muted">FOBBS Apartment and Suites offers a choice of hotel rooms and serviced apartments, with an online booking process designed to be simple and clear.</p>
            <p className="mt-4 max-w-[54ch] text-muted">{about.intro ?? todo("Replace with the hotel’s own introduction")}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-black py-24 text-[#f2efe8] md:py-32">
        <div className={`${wrap} grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-20`}>
          <Reveal>
            <span className={eyebrow}>Our approach</span>
            <p className="font-serif text-4xl leading-tight md:text-6xl">Your Comfort, Our Priority.</p>
            <p className="mt-6 max-w-[54ch] text-[#b9b2a0]">{about.philosophy ?? todo("Replace with the hotel’s hospitality philosophy")}</p>
          </Reveal>
          <div className="grid grid-cols-2 items-start gap-3">
            <Reveal><SiteImage spec={images.reception} sizes="(min-width:1024px) 22vw, 45vw" /></Reveal>
            <Reveal delay={0.12} className="mt-10"><SiteImage spec={images.lounge} sizes="(min-width:1024px) 22vw, 45vw" /></Reveal>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className={`${wrap} grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20`}>
          <div>
            <Reveal><span className={eyebrow}>What to expect</span><h2 className="font-serif text-4xl md:text-5xl">A stay that’s easy from the start.</h2></Reveal>
            <ol className="mt-10 border-t border-black/10">
              {expect.map(([t, d], i) => (
                <Reveal key={t} delay={i * 0.08}>
                  <li className="flex gap-6 border-b border-black/10 py-6"><span className="font-serif text-2xl text-gold">0{i + 1}</span><div><h3 className="font-serif text-xl">{t}</h3><p className="mt-1 text-muted">{d}</p></div></li>
                </Reveal>
              ))}
            </ol>
          </div>
          <Reveal><SiteImage spec={images.apartmentLiving} sizes="(min-width:1024px) 50vw, 100vw" /></Reveal>
        </div>
      </section>

      <section className="bg-cream py-24 md:py-32">
        <div className={wrap}>
          <Reveal className="mb-12"><span className={eyebrow}>Accommodation</span><h2 className="font-serif text-4xl md:text-5xl">Two ways to stay.</h2></Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            {panels.map((p, i) => {
              const names = accommodations.filter((a) => a.type === p.type).map((a) => a.name);
              return (
                <Reveal key={p.title} delay={i * 0.1}>
                  <Link href={p.href} className="group grid h-full grid-cols-[2fr_3fr] border border-black/10 bg-white">
                    <div className="relative overflow-hidden"><div className={`absolute inset-0 ${zoom}`}><SiteImage spec={p.spec} fill sizes="25vw" /></div></div>
                    <div className="flex flex-col justify-between gap-6 p-6">
                      <div><h3 className="font-serif text-2xl">{p.title}</h3><ul className="mt-3 space-y-1 text-sm text-muted">{names.map((n) => <li key={n}>{n}</li>)}</ul></div>
                      <span className="text-sm font-semibold underline decoration-gold underline-offset-4">Explore</span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-muted">Categories shown are sample data until the hotel confirms its rooms and apartments.</p>
        </div>
      </section>

      <section className="relative overflow-hidden bg-black py-28 text-center text-white md:py-36">
        <SiteImage spec={images.heroSecondary} fill sizes="100vw" />
        <div className="absolute inset-0 bg-black/65" />
        <Reveal className={`${wrap} relative`}>
          <h2 className="font-serif text-4xl md:text-6xl">Your next stay starts here.</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/book" className="bg-gold px-6 py-3.5 font-semibold text-black transition-colors hover:bg-champagne">Book Your Stay</Link>
            <Link href="/contact" className="border border-white/70 px-6 py-3.5 font-semibold transition-colors hover:bg-white/10">Contact Us</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}