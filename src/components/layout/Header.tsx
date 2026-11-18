"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { mainNav } from "@/config/site";

export default function Header() {
  const path = usePathname();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const overHero = path === "/";

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  const dark = solid || !overHero;
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <>
      <header className={`print:hidden fixed inset-x-0 top-0 z-50 text-white transition-colors duration-300 ${dark ? "bg-black shadow-[0_1px_0_rgba(201,163,72,.35)]" : "bg-transparent"}`}>
        <div className="mx-auto flex h-[68px] max-w-[1240px] items-center justify-between px-5">
          <Link href="/" className="flex h-full items-center py-2" aria-label="FOBBS Apartment and Suites, home">
            <Image src="/images/logo/fobbs-logo-light.png" alt="FOBBS Apartment and Suites" width={1000} height={860} priority className="h-[52px] w-auto" />
          </Link>
          <nav aria-label="Main" className="hidden gap-8 md:flex">
            {mainNav.map((n) => (
              <Link key={n.href} href={n.href} aria-current={active(n.href) ? "page" : undefined}
                className={`border-b py-1 text-sm transition-colors hover:border-gold ${active(n.href) ? "border-gold" : "border-transparent"}`}>{n.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/contact" aria-label="Contact" className="hidden p-2 md:block"><Phone size={18} /></Link>
            <Link href="/book" className="bg-gold px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-champagne">Book Now</Link>
            <button className="grid h-11 w-11 place-items-center md:hidden" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}><Menu /></button>
          </div>
        </div>
      </header>
      <div className={`print:hidden fixed inset-y-0 right-0 z-[60] w-[min(86vw,340px)] bg-black px-8 pt-20 text-white transition-transform duration-300 ${open ? "translate-x-0" : "invisible translate-x-full"}`} aria-hidden={!open}>
        <button className="absolute right-3 top-3 grid h-11 w-11 place-items-center" aria-label="Close menu" onClick={() => setOpen(false)}><X /></button>
        {[...mainNav, { href: "/book", label: "Book Now" }].map((n) => (
          <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="block border-b border-white/10 py-3 font-serif text-2xl">{n.label}</Link>
        ))}
      </div>
    </>
  );
}