import type { Metadata } from "next";
import { Suspense } from "react";
import LookupForm from "@/components/booking/LookupForm";

export const metadata: Metadata = { title: "Find your booking", description: "Look up an existing FOBBS reservation with your booking reference.", robots: { index: false } };

type SP = Promise<Record<string, string | string[] | undefined>>;

async function Form({ searchParams }: { searchParams: SP }) {
  const raw = (await searchParams).ref;
  const ref = ((Array.isArray(raw) ? raw[0] : raw) ?? "").trim().toUpperCase();
  return <LookupForm initialRef={/^[A-Z0-9-]{4,24}$/.test(ref) ? ref : ""} />;
}

export default function LookupPage({ searchParams }: { searchParams: SP }) {
  return (
    <>
      <section className="bg-black pb-12 pt-28 text-white print:hidden">
        <div className="mx-auto w-[min(1100px,100%-2.5rem)]">
          <span className="mb-3 block text-sm tracking-wide text-champagne">Your reservation</span>
          <h1 className="font-serif text-4xl md:text-5xl">Find your booking</h1>
          <p className="mt-3 max-w-[52ch] text-[#cfc9b9]">Enter your booking reference and the email address or phone number you booked with.</p>
        </div>
      </section>
      <div className="py-12 print:py-0">
        <Suspense fallback={<div className="mx-auto h-72 w-[min(560px,100%-2.5rem)] animate-pulse bg-cream" aria-hidden />}><Form searchParams={searchParams} /></Suspense>
      </div>
    </>
  );
}