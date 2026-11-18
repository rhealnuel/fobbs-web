export type AccommodationType = "Hotel room" | "Serviced apartment";

export interface Accommodation {
  slug: string;
  name: string;
  type: AccommodationType;
  description: string;
  maxGuests: number;
  sizeSqm: number | null;       // null until confirmed
  bathroom: string | null;      // null until confirmed
  beds: string | null;          // null until confirmed
  pricePerNight: number | null; // null until configured
  amenities: string[];          // only confirmed amenities
  photos: string[];             // filenames under public/images
}