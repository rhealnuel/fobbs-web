import { accommodations } from "@/data/accommodations";
import { calcPrice, nightsBetween } from "@/lib/pricing";
import type { Accommodation } from "@/types/accommodation";
import type { AvailabilityResponse, BookingQuery } from "@/types/booking";

export interface AvailabilityService {
  search(q: BookingQuery): Promise<AvailabilityResponse>;
}

const matches = (a: Accommodation, type?: string) =>
  !type || (type === "room" && a.type === "Hotel room") || (type === "apartment" && a.type === "Serviced apartment") || a.slug === type;

/**
 * MOCK service. It does NOT know real inventory: it only checks guest capacity.
 * To connect the backend, replace this object with a fetch to the NestJS API
 * (for example GET `${process.env.API_URL}/availability?...`) returning the same AvailabilityResponse.
 */
const mock: AvailabilityService = {
  async search(q) {
    await new Promise((r) => setTimeout(r, 400));
    const nights = nightsBetween(q.checkIn, q.checkOut);
    const guests = q.adults + q.children;
    const results = accommodations.filter((a) => matches(a, q.type)).map((a) => {
      const fits = guests <= a.maxGuests;
      return {
        accommodation: a,
        availability: fits ? ("available" as const) : ("unavailable" as const),
        reason: fits ? undefined : `Sleeps up to ${a.maxGuests} guests`,
        nights,
        total: a.pricePerNight ? calcPrice(a.pricePerNight, nights).total : null,
      };
    });
    results.sort((x, y) => Number(y.availability === "available") - Number(x.availability === "available"));
    return { ok: true, source: "mock", results };
  },
};

export const availabilityService: AvailabilityService = mock;