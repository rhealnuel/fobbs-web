import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { TriangleAlert } from "lucide-react";
import BookingSteps from "@/components/booking/BookingSteps";
import BookingSummary from "@/components/booking/BookingSummary";
import GuestForm from "@/components/booking/GuestForm";
import { getAccommodation } from "@/data/accommodations";
import { parseQuery, queryString } from "@/lib/bookng";

export const metadata: Metadata = { title: "Guest details", robots: { index: false } };

type SP = Promise<Record<string, string | string[] | undefined>>;
const wrap = "mx-auto w-[min(1100px,100%-2.5rem)]";

function Problem({ message }: { message: string }) {
  return (
    <div className={`${wrap} py-20`}>
      <div role="alert" className="mx-auto max-w-[520px] border border-black/10 bg-white p-10 text-center">
        <TriangleAlert className="mx-auto mb-3 text-gold" />
        <h2 className="font-serif text-2xl">We need your stay details first</h2>
        <p className="mt-2 text-muted">{message}</p>
        <Link href="/book" className="mt-6 inline-block bg-gold px-6 py-3 font-semibold text-black hover:bg-champagne">Back to search</Link>
      </div>
    </div>
  );
}

async function Content({ searchParams }: { searchParams: SP }) {
  await connection();
  const sp = await searchParams;
  const { query, error } = parseQuery(sp);
  const slug = Array.isArray(sp.slug) ? sp.slug[0] : sp.slug;
  const a = slug ? getAccommodation(slug) : undefined;
  if (!query) return <Problem message={error ?? "Choose your dates and a room or apartment to continue."} />;
  if (!a) return <Problem message="We couldn’t find that room or apartment. Please choose again." />;
  if (query.adults + query.children > a.maxGuests) return <Problem message={`${a.name} sleeps up to ${a.maxGuests} guests. Please change your selection.`} />;

  const stay = { ...query, type: undefined };
  const base = queryString(stay, { slug: a.slug });
  return (
    <div className={`${wrap} grid gap-10 py-12 lg:grid-cols-[1fr_380px] lg:gap-14`}>
      <div>
        <h2 className="font-serif text-3xl">Who’s staying?</h2>
        <p className="mb-8 mt-2 text-muted">We’ll use these details for your booking. Nothing is reserved or charged yet.</p>
        <GuestForm nextQuery={base} backHref={`/book?${queryString(query)}`} />
      </div>
      <BookingSummary a={a} q={query} />
    </div>
  );
}

export default function GuestDetailsPage({ searchParams }: { searchParams: SP }) {
  return (
    <>
      <section className="bg-black pb-10 pt-28 text-white">
        <div className={wrap}><BookingSteps current={2} /><h1 className="mt-6 font-serif text-4xl md:text-5xl">Guest details</h1></div>
      </section>
      <Suspense fallback={<div className={`${wrap} py-12`}><div className="h-96 animate-pulse bg-cream" aria-hidden /></div>}>
        <Content searchParams={searchParams} />
      </Suspense>
    </>
  );
}