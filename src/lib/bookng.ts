import type { BookingQuery } from "@/types/booking";

type Params = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const isDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));
const num = (s: string, min: number, max: number, fallback: number) => {
  const n = Number(s);
  return Number.isInteger(n) ? Math.min(max, Math.max(min, n)) : fallback;
};

/** Reads and validates booking search params from the URL. Call only at request time (after awaiting searchParams). */
export function parseQuery(sp: Params): { query: BookingQuery | null; error: string | null } {
  const checkIn = one(sp.checkIn);
  const checkOut = one(sp.checkOut);
  if (!checkIn && !checkOut) return { query: null, error: null };
  if (!isDate(checkIn) || !isDate(checkOut)) return { query: null, error: "Choose both a check-in and a check-out date." };
  if (checkIn < new Date().toISOString().slice(0, 10)) return { query: null, error: "Check-in can’t be in the past." };
  if (checkOut <= checkIn) return { query: null, error: "Check-out must be after check-in." };
  return {
    query: { checkIn, checkOut, adults: num(one(sp.adults), 1, 10, 2), children: num(one(sp.children), 0, 10, 0), type: one(sp.type) || undefined },
    error: null,
  };
}

export const queryString = (q: BookingQuery, extra: Record<string, string> = {}) =>
  new URLSearchParams({ checkIn: q.checkIn, checkOut: q.checkOut, adults: String(q.adults), children: String(q.children), ...(q.type ? { type: q.type } : {}), ...extra }).toString();