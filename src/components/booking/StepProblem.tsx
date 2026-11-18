import Link from "next/link";
import { TriangleAlert } from "lucide-react";

export default function StepProblem({ message, href = "/book", cta = "Back to search" }: { message: string; href?: string; cta?: string }) {
  return (
    <div className="mx-auto w-[min(1100px,100%-2.5rem)] py-20">
      <div role="alert" className="mx-auto max-w-[520px] border border-black/10 bg-white p-10 text-center">
        <TriangleAlert className="mx-auto mb-3 text-gold" />
        <h2 className="font-serif text-2xl">We need a little more first</h2>
        <p className="mt-2 text-muted">{message}</p>
        <Link href={href} className="mt-6 inline-block bg-gold px-6 py-3 font-semibold text-black hover:bg-champagne">{cta}</Link>
      </div>
    </div>
  );
}