import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { CalendarSearch, SearchX, TriangleAlert } from "lucide-react";
import BookingSteps from "@/components/booking/BookingSteps";
import SearchForm from "@/components/booking/SearchForm";
import ResultCard from "@/components/booking/ResultCard";
import { availabilityService } from "@/services/availability";
import { parseQuery, queryString } from "@/lib/bookng";
import type { BookingQuery } from "@/types/booking";

export const metadata: Metadata = { title: "Book your stay", description: "Choose your dates and guests to see available rooms and apartments at FOBBS." };

type SP = Promise<Record<string, string | string[] | undefined>>;
const wrap = "mx-auto w-[min(1100px,100%-2.5rem)]";

function Skeleton() {
  return <div className="space-y-6" aria-hidden>{[0, 1].map((i) => <div key={i} className="h-64 animate-pulse bg-cream" />)}</div>;
}

async function Results({ q }: { q: BookingQuery }) {
  const res = await availabilityService.search(q);
  if (!res.ok) {
    return (
      <div role="alert" className="border border-red-200 bg-red-50 p-8 text-center">
        <TriangleAlert className="mx-auto mb-3 text-red-700" />
        <p className="font-serif text-xl">We couldn’t check availability.</p>
        <p className="mt-1 text-muted">{res.error}</p>
        <Link href={`/book?${queryString(q)}`} className="mt-5 inline-block bg-black px-6 py-3 font-semibold text-white">Try again</Link>
      </div>
    );
  }
  const open = res.results.filter((r) => r.availability === "available").length;
  return (
    <>
      {res.source === "mock" && <p className="mb-6 border-l-2 border-gold bg-cream px-4 py-3 text-sm text-muted">Preview mode: availability here is sample data (it only checks guest capacity) until the booking system is connected.</p>}
      <p role="status" className="mb-6 text-sm text-muted">{open} of {res.results.length} options fit {q.adults + q.children} {q.adults + q.children === 1 ? "guest" : "guests"} for {res.results[0]?.nights ?? 0} nights.</p>
      {res.results.length === 0 || open === 0 ? (
        <div className="grid place-items-center border border-dashed border-black/20 px-6 py-16 text-center">
          <SearchX className="mb-3 text-gold" size={30} />
          <h2 className="font-serif text-2xl">Nothing available for those details</h2>
          <p className="mt-2 max-w-[40ch] text-muted">Try different dates, fewer guests, or a different accommodation type.</p>
        </div>
      ) : null}
      <div className="space-y-6">{res.results.map((r) => <ResultCard key={r.accommodation.slug} r={r} q={q} />)}</div>
    </>
  );
}

async function Content({ searchParams }: { searchParams: SP }) {
  await connection(); // request-time: parseQuery compares against today's date
  const { query, error } = parseQuery(await searchParams);
  return (
    <>
      <div className="bg-cream py-8"><div className={wrap}><SearchForm key={query ? queryString(query) : "empty"} initial={query} serverError={error} /></div></div>
      <div className={`${wrap} py-12`}>
        {query ? (
          <Suspense key={queryString(query)} fallback={<Skeleton />}><Results q={query} /></Suspense>
        ) : (
          <div className="grid place-items-center px-6 py-16 text-center">
            <CalendarSearch className="mb-3 text-gold" size={32} />
            <h2 className="font-serif text-2xl">Choose your dates to see what’s available</h2>
            <p className="mt-2 max-w-[44ch] text-muted">Pick check-in and check-out dates and how many guests are staying.</p>
          </div>
        )}
      </div>
    </>
  );
}

export default function BookPage({ searchParams }: { searchParams: SP }) {
  return (
    <>
      <section className="bg-black pb-10 pt-28 text-white">
        <div className={wrap}>
          <BookingSteps current={1} />
          <h1 className="mt-6 font-serif text-4xl md:text-5xl">Book your stay</h1>
        </div>
      </section>
      <Suspense fallback={<div className="h-40 animate-pulse bg-cream" aria-hidden />}><Content searchParams={searchParams} /></Suspense>
    </>
  );
}