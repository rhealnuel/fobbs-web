import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import ContactForm from "@/components/common/ContactForm";
import Reveal from "@/components/common/Reveal";
import SiteImage from "@/components/common/SiteImage";
import SlowZoom from "@/components/common/SlowZoom";
import { images } from "@/config/images";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Contact", description: "Contact FOBBS Apartment and Suites." };

const wrap = "mx-auto w-[min(1240px,100%-2.5rem)]";

export default function ContactPage() {
  const c = site.contact;
  const wa = c.whatsapp ? `https://wa.me/${c.whatsapp.replace(/\D/g, "")}` : null;
  const items = [
    { Icon: Phone, label: "Phone", value: c.phone, href: c.phone ? `tel:${c.phone.replace(/[^\d+]/g, "")}` : null },
    { Icon: Mail, label: "Email", value: c.email, href: c.email ? `mailto:${c.email}` : null },
    { Icon: MessageCircle, label: "WhatsApp", value: c.whatsapp, href: wa },
    { Icon: MapPin, label: "Address", value: c.address, href: null },
    ...(c.hours ? [{ Icon: Clock, label: "Opening hours", value: c.hours, href: null }] : []),
  ];
  return (
    <>
      <section className="relative flex min-h-[46svh] items-end overflow-hidden bg-black pb-12 pt-32 text-white">
        <SlowZoom><SiteImage spec={images.bannerContact} fill priority sizes="100vw" /></SlowZoom>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/55" />
        <div className={`${wrap} relative`}>
          <Reveal delay={0.15}><span className="mb-3 block text-sm tracking-wide text-champagne">Contact</span></Reveal>
          <Reveal delay={0.3}><h1 className="font-serif text-4xl md:text-6xl">We’d like to hear from you.</h1></Reveal>
          <Reveal delay={0.45}><p className="mt-4 max-w-[52ch] text-[#e7e2d4]">Questions about a room, an apartment or an existing booking? Send us a message or use the details below.</p></Reveal>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className={`${wrap} grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20`}>
          <Reveal>
            <h2 className="font-serif text-3xl">Get in touch</h2>
            <ul className="mt-6 border-t border-black/10">
              {items.map(({ Icon, label, value, href }) => (
                <li key={label} className="flex gap-4 border-b border-black/10 py-5">
                  <Icon size={20} className="mt-0.5 shrink-0 text-gold" />
                  <div><p className="text-sm text-muted">{label}</p>
                    {value ? (href ? <a href={href} className="underline-offset-4 hover:underline">{value}</a> : <p>{value}</p>) : <p className="text-muted">To be supplied</p>}</div>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}><h2 className="mb-6 font-serif text-3xl">Send a message</h2><ContactForm /></Reveal>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className={wrap}>
          <Reveal>
            {c.mapUrl ? (
              <iframe src={c.mapUrl} title="FOBBS location map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-[420px] w-full border-0" />
            ) : (
              <div className="grid h-[320px] place-items-center bg-cream text-center">
                <div><MapPin className="mx-auto mb-3 text-gold" size={28} /><p className="font-serif text-xl">Map</p><p className="mt-1 text-sm text-muted">The map will appear here once the hotel’s address is supplied.</p></div>
              </div>
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}