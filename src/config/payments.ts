// "mock": no real money moves; the payment page shows a clearly labelled test panel.
// "live": the page redirects to the payment gateway and trusts only the server's verification.
export const paymentMode: "mock" | "live" = process.env.NEXT_PUBLIC_PAYMENT_MODE === "live" ? "live" : "mock";

// Only list methods the hotel has confirmed. Anything else stays out until supplied.
export const paymentMethods = [
  { id: "paystack", label: "Pay online with Paystack", note: "Card or bank payment, completed on Paystack.", enabled: true },
] as const;