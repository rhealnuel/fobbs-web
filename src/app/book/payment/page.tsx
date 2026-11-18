import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import BookingSteps from "@/components/booking/BookingSteps";
import BookingSummary from "@/components/booking/BookingSummary";
import PaymentPanel from "@/components/booking/PaymentPanel";
import StepProblem from "@/components/booking/StepProblem";
import { getAccommodation } from "@/data/accommodations";
import { parseQuery, queryString } from "@/lib/bookng";
import { calcPrice, nightsBetween } from "@/lib/pricing";

export const metadata: Metadata = { title: "Payment", robots: { index: false } };

type SP = Promise<Record<string, string | string[] | undefined>>;
const wrap = "mx-auto w-[min(1100px,100%-2.5rem)]";

async function Content({ searchParams }: { searchParams: SP }) {
  await connection();
  const sp = await searchParams;
  const { query, error } = parseQuery(sp);
  const slug = Array.isArray(sp.slug) ? sp.slug[0] : sp.slug;
  const a = slug ? getAccommodation(slug) : undefined;
  if (!query) return <StepProblem message={error ?? "Choose your dates and a room or apartment to continue."} />;
  if (!a) return <StepProblem message="We couldn’t find that room or apartment. Please choose again." />;
  if (query.adults + query.children > a.maxGuests) return <StepProblem message={`${a.name} sleeps up to ${a.maxGuests} guests. Please change your selection.`} />;

  const stay = { slug: a.slug, checkIn: query.checkIn, checkOut: query.checkOut, adults: query.adults, children: query.children };
  const total = a.pricePerNight ? calcPrice(a.pricePerNight, nightsBetween(query.checkIn, query.checkOut)).total : null;
  const guestHref = `/book/guest-details?${queryString({ ...query, type: undefined }, { slug: a.slug })}`;
  return (
    <div className={`${wrap} grid gap-10 py-12 lg:grid-cols-[1fr_380px] lg:gap-14`}>
      <div>
        <h2 className="font-serif text-3xl">Review and pay</h2>
        <p className="mb-8 mt-2 text-muted">Your booking is confirmed only after payment is verified.</p>
        <PaymentPanel stay={stay} total={total} guestHref={guestHref} />
      </div>
      <BookingSummary a={a} q={query} />
    </div>
  );
}

export default function PaymentPage({ searchParams }: { searchParams: SP }) {
  return (
    <>
      <section className="bg-black pb-10 pt-28 text-white">
        <div className={wrap}><BookingSteps current={3} /><h1 className="mt-6 font-serif text-4xl md:text-5xl">Payment</h1></div>
      </section>
      <Suspense fallback={<div className={`${wrap} py-12`}><div className="h-96 animate-pulse bg-cream" aria-hidden /></div>}><Content searchParams={searchParams} /></Suspense>
    </>
  );
}