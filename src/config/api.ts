// "mock": forms don't reach the hotel and the UI says so. "live": talks to the NestJS API.
export const apiMode: "mock" | "live" = process.env.NEXT_PUBLIC_API_MODE === "live" ? "live" : "mock";