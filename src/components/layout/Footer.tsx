import Image from "next/image";
import Link from "next/link";
import { accommodations } from "@/data/accommodations";
import { footerNav, site } from "@/config/site";

const tbs = (v: string | null) => v ?? "To be supplied";

export default function Footer() {
  const c = site.contact;
  return (
    <footer className="print:hidden bg-black px-5 pb-8 pt-16 text-sm text-[#b9b2a0]">
      <div className="mx-auto grid max-w-[1240px] gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Image src="/images/logo/fobbs-logo-light.png" alt="FOBBS Apartment and Suites" width={1000} height={860} className="h-28 w-auto" />
          <p className="mt-4 max-w-[30ch]">Hotel rooms and serviced apartments.</p>
        </div>
        <div>
          <h4 className="mb-3 font-serif text-base text-white">Explore</h4>
          <ul className="space-y-1">{footerNav.map((n) => <li key={n.href}><Link href={n.href} className="hover:text-champagne">{n.label}</Link></li>)}</ul>
        </div>
        <div>
          <h4 className="mb-3 font-serif text-base text-white">Accommodations</h4>
          <ul className="space-y-1">{accommodations.map((a) => <li key={a.slug}><Link href={`/accommodations/${a.slug}`} className="hover:text-champagne">{a.name}</Link></li>)}</ul>
        </div>
        <div>
          <h4 className="mb-3 font-serif text-base text-white">Contact</h4>
          <ul className="space-y-1">
            <li>Phone: {tbs(c.phone)}</li><li>Email: {tbs(c.email)}</li><li>WhatsApp: {tbs(c.whatsapp)}</li><li>Address: {tbs(c.address)}</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-[1240px] flex-wrap justify-between gap-3 border-t border-white/10 pt-6">
        <span>&copy; {site.year} {site.name}</span>
        <span className="flex gap-4"><Link href="/faq">Privacy Policy</Link><Link href="/faq">Terms and Conditions</Link></span>
      </div>
    </footer>
  );
}