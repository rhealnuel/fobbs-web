import type { Accommodation } from "@/types/accommodation";

export interface BookingQuery {
  checkIn: string;   // YYYY-MM-DD
  checkOut: string;  // YYYY-MM-DD
  adults: number;
  children: number;
  type?: string;     // "room" | "apartment" | an accommodation slug
}

export interface AvailabilityResult {
  accommodation: Accommodation;
  availability: "available" | "unavailable";
  reason?: string;
  nights: number;
  total: number | null; // null until a price is configured
}

export type AvailabilityResponse =
  | { ok: true; source: "mock" | "live"; results: AvailabilityResult[] }
  | { ok: false; error: string };