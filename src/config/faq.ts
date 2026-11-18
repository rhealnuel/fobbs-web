import { policies } from "@/config/booking";
import { paymentMethods, paymentMode } from "@/config/payments";

export interface FaqItem { q: string; a: string; link?: { href: string; label: string } }

// Answers that depend on hotel policy read from src/config/booking.ts. Until the hotel supplies them, they say so.
const tbc = "The hotel hasn’t published this yet and will confirm it. Please contact the hotel if you need it before booking.";
const methods = paymentMethods.filter((m) => m.enabled).map((m) => m.label.toLowerCase()).join(", ");

export const faqs: FaqItem[] = [
  { q: "How do I make a reservation?", a: "Choose your dates and number of guests on the booking page, pick a room or apartment from the options shown, enter your details and complete payment. Your booking is confirmed only after payment has been verified.", link: { href: "/book", label: "Start a booking" } },
  { q: "What are the check-in and check-out times?", a: policies.checkIn || policies.checkOut ? `Check-in: ${policies.checkIn ?? "to be confirmed"}. Check-out: ${policies.checkOut ?? "to be confirmed"}.` : tbc },
  { q: "How can I pay?", a: paymentMode === "live" ? `You can pay online: ${methods}. ${policies.payment ?? ""}`.trim() : "Online payment will be available once the booking system goes live. The hotel will confirm the accepted payment methods." },
  { q: "What is the cancellation policy?", a: policies.cancellation ?? tbc },
  { q: "How will I know my booking is confirmed?", a: "After your payment is verified, you’ll see a confirmation page with your booking reference, which you can print or save as PDF. Until then the booking is shown as pending.", link: { href: "/booking/lookup", label: "Find an existing booking" } },
  { q: "How many guests can a room or apartment take?", a: "Every room and apartment lists the maximum number of guests it sleeps. When you search with your party size, only options that fit are shown as available.", link: { href: "/accommodations", label: "Browse accommodations" } },
  { q: "Can I make a special request?", a: "Yes. You can add a request on the guest details step of your booking. Requests are passed to the hotel but can’t be guaranteed. For anything urgent, contact the hotel directly.", link: { href: "/contact", label: "Contact the hotel" } },
];