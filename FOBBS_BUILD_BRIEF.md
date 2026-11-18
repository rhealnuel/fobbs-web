# FOBBS Apartment and Suites: Public Website Build Brief (for Claude Code)

Build the complete, multi-page public website. Do NOT build the admin app (it lives separately on admin.fobbs.com).

## First steps
1. Inspect the existing project structure and keep any good work. Do not discard it needlessly.
2. Read `IMAGE_ASSETS.md` (exact filenames and folders under `public/images/`).
3. Reference prototype: `fobbs-homepage.html` (visual direction, placeholder behaviour, content rules). It is a single-page prototype and must NOT be copied as the architecture.

## Hard rule
The homepage contains only homepage content. Every major section is its own route. No anchor-link navigation between sections.

## Routes (App Router, TypeScript)
| Route | Purpose |
|---|---|
| `/` | Homepage only |
| `/accommodations` | Listing with filters (type, guests, price, dates), sorting, empty state |
| `/accommodations/[slug]` | Detail: gallery and lightbox, info, sticky booking panel, similar rooms |
| `/book` | Search (dates, adults, children, type) then availability results |
| `/book/guest-details` | Guest form with validation |
| `/book/payment` | Summary and payment structure (Paystack-ready), pending/success/failed states |
| `/booking/confirmation` | Reference, details, print/download |
| `/booking/lookup` | Reference plus email or phone, verified lookup |
| `/about` | Editorial, photography-led |
| `/gallery` | Category filters, lightbox with next/previous |
| `/contact` | Details, form, map slot |
| `/faq` | Accordion |

Also add `not-found.tsx`, `error.tsx`, `loading.tsx`, `sitemap.ts`, `robots.ts` and per-page metadata with Open Graph.

## Navigation
Shared header: Home, Accommodations, About, Gallery, Contact, plus a prominent **Book Now** button to `/book`. Sticky, transparent over heroes then solid, clear active state, mobile drawer. Footer links to every public route. Every link must open its real route.

## Stack
Next.js App Router, TypeScript, Tailwind CSS, Framer Motion (subtle, respect `prefers-reduced-motion`), Lucide icons, `next/font` (Playfair Display + DM Sans).

## Design
Colours: black #080808, charcoal #151515, gold #C9A348, champagne #E6CB83, warm white #FAF9F6, cream #F4F0E8, text #202020, secondary #777777. Mostly light sections with selected dark chapters. Generous space, hairline borders, minimal radius. Each page gets a layout suited to its purpose, with one shared design language.

## Structure
```
src/
  app/ (routes above)
  components/{layout,navigation,homepage,accommodation,booking,gallery,common}
  config/site.ts          # contact details, nullable until supplied
  config/images.ts        # centralized image registry (filename, alt, ratio, description)
  data/accommodations.ts  # categories and rooms, data-driven
  services/               # api client interfaces + mock implementations, separate from UI
  types/ hooks/ lib/
```

## Images
- One `<SiteImage id="..."/>` component reads `config/images.ts`. If the file exists in `public/images/`, show it via `next/image`; otherwise show a styled placeholder with the same aspect ratio, and show filename and description only in development.
- Use exact filenames from `IMAGE_ASSETS.md`. No stock photos. Keep `IMAGE_ASSETS.md` updated when slots are added.

## Data and honesty rules
Do not invent prices, room counts, address, phone, facilities, reviews, awards, history or policies. Keep them configurable (null shows "to be supplied"). Mock services must be clearly labelled. Never fake a successful payment or a confirmed booking: confirmation only after the (mock or real) service returns a created booking, payment status only after server-side verification. Lookup must never expose another guest's booking.

## Booking flow
Search → results → select → guest details → summary → payment → confirmation. Validate dates (check-out after check-in, no past dates) and guest capacity. Persist selections across steps and Back navigation. Pricing: nights x rate, with configurable fees and taxes (default none).

## Quality bar
Responsive at mobile, tablet, laptop and large desktop; no horizontal scroll; 44px touch targets; semantic HTML, labels, focus states, alt text; loading, empty and error states on every data view.

## Done means
`npm run build` and `tsc --noEmit` pass; `npm run dev` runs; every route loads; every nav and footer link works; the full booking flow is tested end to end with the mock service; no broken images (placeholders where photos are missing); layouts checked at mobile, tablet and desktop. Report what was verified and what was not.
