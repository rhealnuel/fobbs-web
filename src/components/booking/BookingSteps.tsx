const steps = ["Search", "Guest details", "Payment", "Confirmation"];

export default function BookingSteps({ current }: { current: 1 | 2 | 3 | 4 }) {
  return (
    <ol aria-label="Booking progress" className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
      {steps.map((s, i) => {
        const n = i + 1;
        const state = n < current ? "done" : n === current ? "now" : "next";
        return (
          <li key={s} aria-current={state === "now" ? "step" : undefined} className={`flex items-center gap-2 ${state === "next" ? "text-white/45" : "text-white"}`}>
            <span className={`grid h-6 w-6 place-items-center rounded-full border text-xs ${state === "now" ? "border-gold bg-gold text-black" : state === "done" ? "border-gold text-gold" : "border-white/30"}`}>{n}</span>{s}
          </li>
        );
      })}
    </ol>
  );
}