import type { ReactNode } from "react";

/** Temporary page frame used by routes that are not designed yet. */
export default function PageShell({ title, intro, children }: { title: string; intro?: string; children?: ReactNode }) {
  return (
    <>
      <div className="bg-black px-5 pb-16 pt-32 text-white">
        <div className="mx-auto max-w-[1240px]">
          <h1 className="font-serif text-4xl md:text-6xl">{title}</h1>
          {intro && <p className="mt-4 max-w-[52ch] text-[#cfc9b9]">{intro}</p>}
        </div>
      </div>
      <div className="mx-auto max-w-[1240px] px-5 py-16">{children ?? <p className="text-muted">This page is being built.</p>}</div>
    </>
  );
}
