// Booking rules. Leave empty/null until the hotel confirms them. Never invent fees or policies.
export const booking = {
  currency: "₦",
  fees: [] as { label: string; type: "percent" | "fixed"; value: number }[], // e.g. { label: "Service fee", type: "percent", value: 5 }
};

export const policies = {
  checkIn: null as string | null,
  checkOut: null as string | null,
  cancellation: null as string | null,
  payment: null as string | null,
};