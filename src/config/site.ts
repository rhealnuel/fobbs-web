// Contact details are null until the hotel supplies them. Never invent values.
export const site = {
  name: "FOBBS Apartment and Suites",
  short: "FOBBS",
  year: 2026, // update yearly (Next.js 16 disallows new Date() during prerender)
  description: "Hotel rooms and serviced apartments. Check availability and book your stay.",
  contact: {
    phone: null as string | null,
    email: null as string | null,
    whatsapp: null as string | null,
    address: null as string | null,
    hours: null as string | null,   // e.g. front-desk hours, only if the hotel supplies them
    mapUrl: null as string | null,  // Google Maps embed URL, once the address is confirmed
  },
  social: { instagram: null as string | null, facebook: null as string | null },
};

export const mainNav = [
  { href: "/", label: "Home" },
  { href: "/accommodations", label: "Accommodations" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export const footerNav = [
  ...mainNav,
  { href: "/faq", label: "FAQ" },
  { href: "/booking/lookup", label: "Find my booking" },
  { href: "/book", label: "Book now" },
];