import Image from "next/image";
import fs from "node:fs";
import path from "node:path";
import type { ImageSpec } from "@/config/images";

const exists = (file: string) => fs.existsSync(path.join(process.cwd(), "public", "images", file));
const dev = process.env.NODE_ENV !== "production";

/** Shows the real photo if it exists in public/images, otherwise a placeholder with the same shape. */
export default function SiteImage({ spec, fill = false, priority = false, sizes = "100vw", className = "" }: {
  spec: ImageSpec; fill?: boolean; priority?: boolean; sizes?: string; className?: string;
}) {
  const real = exists(spec.file);
  return (
    <div className={`${fill ? "absolute inset-0" : "relative"} overflow-hidden bg-charcoal ${className}`} style={fill ? undefined : { aspectRatio: spec.ratio }}>
      {real ? (
        <Image src={`/images/${spec.file}`} alt={spec.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div role="img" aria-label={spec.alt} className="absolute inset-0 bg-[linear-gradient(135deg,#1d1a15,#2c261b_60%,#1a1712)]">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0_46px,rgba(201,163,72,.07)_46px_47px)]" />
          {dev && (
            <p className="absolute inset-x-3 bottom-3 text-[11px] leading-snug text-champagne/90">
              <b className="block break-all font-semibold">images/{spec.file}</b>{spec.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}