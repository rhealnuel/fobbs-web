"use client";
import { useRef, useState } from "react";
import { CircleAlert, FlaskConical, Send } from "lucide-react";
import { contactService, type ContactMessage } from "@/services/contact";

type Errors = Partial<Record<keyof ContactMessage, string>>;
type Phase = "idle" | "sending" | "sent" | "sent-mock" | "error";
const subjects = ["General enquiry", "Booking enquiry", "Existing reservation", "Other"];
const box = "min-h-11 w-full border border-black/15 bg-warm px-3 text-base text-ink outline-none focus:border-gold aria-[invalid=true]:border-red-600";
const lbl = "flex flex-col gap-1 text-sm";

function validate(m: ContactMessage): Errors {
  const e: Errors = {};
  if (m.fullName.trim().length < 2) e.fullName = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m.email.trim())) e.email = "Enter a valid email address, like name@example.com.";
  if (m.phone.trim() && !/^\d{7,15}$/.test(m.phone.replace(/[\s()+-]/g, ""))) e.phone = "Enter a phone number with 7 to 15 digits, or leave it blank.";
  if (!m.subject) e.subject = "Choose a subject.";
  if (m.message.trim().length < 10) e.message = "Tell us a little more (at least 10 characters).";
  else if (m.message.length > 2000) e.message = "Keep your message under 2000 characters.";
  return e;
}

export default function ContactForm() {
  const form = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState("");

  async function submit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const el = ev.currentTarget, f = new FormData(el);
    if (f.get("website")) return; // hidden spam trap: people never fill it in
    const m: ContactMessage = { fullName: String(f.get("fullName") ?? ""), email: String(f.get("email") ?? ""), phone: String(f.get("phone") ?? ""), subject: String(f.get("subject") ?? ""), message: String(f.get("message") ?? "") };
    const e = validate(m);
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) return void (form.current?.elements.namedItem(first) as HTMLElement | null)?.focus();
    setPhase("sending"); setError("");
    const r = await contactService.send({ ...m, fullName: m.fullName.trim(), email: m.email.trim(), message: m.message.trim() });
    if (!r.ok) { setError(r.error); setPhase("error"); return; }
    el.reset();
    setPhase(r.data.mock ? "sent-mock" : "sent");
  }

  const err = (k: keyof ContactMessage) => errors[k] && <span id={`${k}-err`} role="alert" className="text-sm text-red-700">{errors[k]}</span>;
  const aria = (k: keyof ContactMessage) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-err` : undefined });

  return (
    <form ref={form} onSubmit={submit} noValidate className="space-y-5 border border-black/10 bg-white p-6 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className={lbl}>Full name<input name="fullName" autoComplete="name" className={box} {...aria("fullName")} />{err("fullName")}</label>
        <label className={lbl}>Email<input name="email" type="email" autoComplete="email" className={box} {...aria("email")} />{err("email")}</label>
        <label className={lbl}>Phone <span className="text-muted">(optional)</span><input name="phone" type="tel" autoComplete="tel" className={box} {...aria("phone")} />{err("phone")}</label>
        <label className={lbl}>Subject
          <select name="subject" defaultValue="" className={box} {...aria("subject")}><option value="" disabled>Choose a subject</option>{subjects.map((s) => <option key={s}>{s}</option>)}</select>{err("subject")}
        </label>
      </div>
      <label className={lbl}>Message<textarea name="message" rows={6} maxLength={2100} className={`${box} py-2`} {...aria("message")} />{err("message")}</label>
      <div className="absolute -left-[9999px]" aria-hidden><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <button type="submit" disabled={phase === "sending"} className="flex min-h-12 items-center gap-2 bg-gold px-8 font-semibold text-black transition-colors hover:bg-champagne disabled:opacity-60"><Send size={16} />{phase === "sending" ? "Sending…" : "Send message"}</button>
      <div aria-live="polite">
        {phase === "sent" && <p className="border-l-2 border-gold bg-cream p-4 text-sm"><b>Message sent.</b> Thank you. The hotel will reply to the email address you gave.</p>}
        {phase === "sent-mock" && <p className="flex gap-2 border-l-2 border-gold bg-cream p-4 text-sm"><FlaskConical size={16} className="mt-0.5 shrink-0 text-gold" /><span><b>Test mode.</b> The form works, but no message was sent to the hotel. Please use the contact details on this page for now.</span></p>}
        {phase === "error" && <p role="alert" className="flex gap-2 border-l-2 border-red-600 bg-red-50 p-4 text-sm"><CircleAlert size={16} className="mt-0.5 shrink-0 text-red-700" />{error}</p>}
      </div>
    </form>
  );
}