import { apiMode } from "@/config/api";
import type { Result } from "@/services/payment";

export interface ContactMessage { fullName: string; email: string; phone: string; subject: string; message: string }
export interface ContactService { send(m: ContactMessage): Promise<Result<{ mock: boolean }>> }

/** MOCK: nothing is sent anywhere. The form says so. */
const mock: ContactService = {
  async send() { await new Promise((r) => setTimeout(r, 600)); return { ok: true, data: { mock: true } }; },
};

/** LIVE: connect to the NestJS API, for example POST `${process.env.NEXT_PUBLIC_API_URL}/contact` with the message as JSON. */
const live: ContactService = { send: async () => ({ ok: false, error: "The contact form isn’t connected yet. Please use the details on this page." }) };

export const contactService: ContactService = apiMode === "live" ? live : mock;