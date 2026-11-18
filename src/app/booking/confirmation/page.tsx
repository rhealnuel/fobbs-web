import type { Metadata } from "next";
import { Suspense } from "react";
import BookingSteps from "@/components/booking/BookingSteps";
import ConfirmationView from "@/components/booking/ConfirmationView";
import StepProblem from "@/components/booking/StepProblem";

export const metadata: Metadata = { title: "Booking confirmation", robots: { index: false } };

type SP = Promise<Record<string, string | string[] | undefined>>;

async function Content({ searchParams }: { searchParams: SP }) {
  const raw = (await searchParams).ref;
  const ref = (Array.isArray(raw) ? raw[0] : raw)?.trim().toUpperCase();
  if (!ref || !/^[A-Z0-9-]{4,24}$/.test(ref)) return <StepProblem message="We need a booking reference to show your confirmation." href="/booking/lookup" cta="Find my booking" />;
  return <ConfirmationView reference={ref} />;
}

export default function ConfirmationPage({ searchParams }: { searchParams: SP }) {
  return (
    <>
      <section className="bg-black pb-10 pt-28 text-white print:hidden">
        <div className="mx-auto w-[min(1100px,100%-2.5rem)]"><BookingSteps current={4} /><h1 className="mt-6 font-serif text-4xl md:text-5xl">Booking confirmation</h1></div>
      </section>
      <div className="py-12 print:py-0">
        <Suspense fallback={<div className="mx-auto h-96 w-[min(820px,100%-2.5rem)] animate-pulse bg-cream" aria-hidden />}><Content searchParams={searchParams} /></Suspense>
      </div>
    </>
  );
}