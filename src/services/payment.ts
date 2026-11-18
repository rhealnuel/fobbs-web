import { paymentMode } from "@/config/payments";
import type { GuestDetails } from "@/lib/draft";

export type PaymentStatus = "pending" | "successful" | "failed";
export const LOOKUP_NOT_FOUND = "not-found";
export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

export interface Booking {
  reference: string;
  slug: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  guest: GuestDetails;
  total: number | null;
  paymentStatus: PaymentStatus;
  mock: boolean;
}
export type NewBooking = Omit<Booking, "reference" | "paymentStatus" | "mock">;

export interface PaymentService {
  createBooking(b: NewBooking): Promise<Result<Booking>>;
  /** Live: returns the gateway URL to redirect to. Mock: returns no URL. */
  initialize(reference: string): Promise<Result<{ authorizationUrl?: string }>>;
  /** Live: the SERVER verifies with the gateway. The browser never decides a payment succeeded. */
  verify(reference: string): Promise<Result<Booking>>;
  get(reference: string): Promise<Result<Booking>>;
  /** Returns the booking ONLY if the contact (email or phone) matches. Same error for "no such booking" and "wrong contact". Live: rate-limit this on the server. */
  lookup(reference: string, contact: string): Promise<Result<Booking>>;
}

/* ---------- MOCK (test mode): bookings live in this browser tab only ---------- */
const STORE = "fobbs:mock-bookings";
const read = (): Record<string, Booking> => { try { return JSON.parse(sessionStorage.getItem(STORE) ?? "{}"); } catch { return {}; } };
const write = (d: Record<string, Booking>) => { try { sessionStorage.setItem(STORE, JSON.stringify(d)); } catch { /* ignore */ } };
const wait = () => new Promise((r) => setTimeout(r, 500));
const makeRef = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return "FOB-" + Array.from(crypto.getRandomValues(new Uint8Array(6)), (n) => chars[n % chars.length]).join("");
};

const mock: PaymentService = {
  async createBooking(b) {
    await wait();
    const booking: Booking = { ...b, reference: makeRef(), paymentStatus: "pending", mock: true };
    write({ ...read(), [booking.reference]: booking });
    return { ok: true, data: booking };
  },
  async initialize(reference) {
    await wait();
    const all = read(), b = all[reference];
    if (!b) return { ok: false, error: "We couldn’t find that booking." };
    write({ ...all, [reference]: { ...b, paymentStatus: "pending" } });
    return { ok: true, data: {} };
  },
  async verify(reference) { return mock.get(reference); },
  async get(reference) {
    await wait();
    const b = read()[reference];
    return b ? { ok: true, data: b } : { ok: false, error: "We couldn’t find that booking." };
  },
  async lookup(reference, contact) {
    await wait();
    const b = read()[reference.trim().toUpperCase()];
    const digits = (v: string) => v.replace(/[\s()+-]/g, "");
    const tail = (v: string) => digits(v).slice(-9);
    const c = contact.trim();
    const match = !!b && (b.guest.email.toLowerCase() === c.toLowerCase() || (digits(c).length >= 7 && tail(b.guest.phone) === tail(c)));
    return match && b ? { ok: true, data: b } : { ok: false, error: LOOKUP_NOT_FOUND };
  },
};

/** Test mode only: stands in for the gateway's result. Never available in live mode. */
export async function simulatePayment(reference: string, outcome: "successful" | "failed") {
  if (paymentMode !== "mock") return;
  const all = read(), b = all[reference];
  if (b) write({ ...all, [reference]: { ...b, paymentStatus: outcome } });
}

/* ---------- LIVE: connect to the NestJS API (not built yet) ----------
   POST   /bookings                 -> creates a booking, status "pending"
   POST   /bookings/:ref/payments   -> initializes Paystack, returns authorization_url
   GET    /bookings/:ref/verify     -> server calls Paystack verify, updates status, returns booking
   Paystack should also call a webhook on the server. Replace the stub below with fetch calls to those routes. */
const notConnected = { ok: false as const, error: "Online payment isn’t connected yet." };
const live: PaymentService = { createBooking: async () => notConnected, initialize: async () => notConnected, verify: async () => notConnected, get: async () => notConnected, lookup: async () => notConnected };

export const paymentService: PaymentService = paymentMode === "live" ? live : mock;