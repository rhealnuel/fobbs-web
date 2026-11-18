// Browser-only draft of the booking in progress. Lives in sessionStorage (cleared when the tab closes),
// so guest details never travel in the URL. Replace with a server-side draft when the backend exists.
export interface GuestDetails { fullName: string; email: string; phone: string; country: string; requests: string }

export const GUEST_KEY = "fobbs:booking-draft";
const KEY = GUEST_KEY;

export function parseGuest(raw: string | null | undefined): GuestDetails | null {
  try { return raw ? (JSON.parse(raw) as GuestDetails) : null; } catch { return null; }
}

export function saveGuest(g: GuestDetails) {
  try { sessionStorage.setItem(KEY, JSON.stringify(g)); } catch { /* storage unavailable: continue without a draft */ }
}
export function loadGuest(): GuestDetails | null {
  try { const v = sessionStorage.getItem(KEY); return v ? (JSON.parse(v) as GuestDetails) : null; } catch { return null; }
}