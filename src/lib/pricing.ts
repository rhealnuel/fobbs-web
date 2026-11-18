import { booking } from "@/config/booking";

export const fmt = (n: number) => `${booking.currency}${n.toLocaleString("en-NG")}`;

export function nightsBetween(checkIn: string, checkOut: string) {
  return Math.round((Date.parse(checkOut) - Date.parse(checkIn)) / 864e5);
}

export function calcPrice(rate: number, nights: number) {
  const subtotal = rate * nights;
  const lines = booking.fees.map((f) => ({ label: f.label, amount: f.type === "percent" ? Math.round((subtotal * f.value) / 100) : f.value }));
  return { subtotal, lines, total: subtotal + lines.reduce((s, l) => s + l.amount, 0) };
}