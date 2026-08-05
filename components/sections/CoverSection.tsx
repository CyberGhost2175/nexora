import { Logo } from "@/components/Logo";
import Image from "next/image";
import type { Dictionary } from "@/lib/i18n";

export function CoverSection({ dict }: { dict: Dictionary }) {
  return (
    <section
      className="a4-page border-b border-outline-variant/20 py-section-gap"
      id="proposal"
    >
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="mb-10">
            <Logo size="hero" priority />
          </div>
          <h1 className="mb-8 text-headline-display leading-tight text-on-surface">
            {dict.cover.title}
          </h1>
          <p className="mb-12 max-w-xl border-l-4 border-primary-container pl-6 text-body-lg text-on-surface-variant">
            {dict.cover.subtitle}
          </p>
          <div className="flex gap-6">
            <a
              href="#pricing"
              className="inline-flex rounded-full bg-primary-container px-8 py-3.5 text-label-sm text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:shadow-xl"
            >
              {dict.cover.cta}
            </a>
          </div>
        </div>
        <div className="relative h-[280px] w-full overflow-hidden rounded-2xl border border-outline-variant/20 shadow-2xl sm:h-[400px] lg:h-[500px]">
          <Image
            src="/images/hero-crm.jpg"
            alt={dict.cover.title}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
      </div>
    </section>
  );
}
