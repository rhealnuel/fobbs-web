import type { Metadata } from "next";
import Link from "next/link";
import Accordion from "@/components/common/Accordion";
import Reveal from "@/components/common/Reveal";
import { faqs } from "@/config/faq";

export const metadata: Metadata = { title: "Frequently asked questions", description: "Answers about booking, payment, check-in and staying at FOBBS Apartment and Suites." };

const wrap = "mx-auto w-[min(1240px,100%-2.5rem)]";

export default function FaqPage() {
  return (
    <>
      <section className="bg-black pb-14 pt-32 text-white">
        <div className={wrap}>
          <Reveal delay={0.1}><span className="mb-3 block text-sm tracking-wide text-champagne">FAQ</span></Reveal>
          <Reveal delay={0.2}><h1 className="max-w-[16ch] font-serif text-4xl md:text-6xl">Questions, answered.</h1></Reveal>
          <Reveal delay={0.3}><p className="mt-4 max-w-[52ch] text-[#cfc9b9]">Everything you may want to know before you book.</p></Reveal>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className={`${wrap} grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-20`}>
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="font-serif text-3xl">Still need help?</h2>
            <p className="mt-3 max-w-[36ch] text-muted">If your question isn’t answered here, send us a message or look up your booking.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact" className="bg-gold px-6 py-3.5 font-semibold text-black transition-colors hover:bg-champagne">Contact Us</Link>
              <Link href="/booking/lookup" className="border border-black/25 px-6 py-3.5 font-semibold transition-colors hover:border-gold">Find my booking</Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}><Accordion items={faqs} /></Reveal>
        </div>
      </section>
    </>
  );
}