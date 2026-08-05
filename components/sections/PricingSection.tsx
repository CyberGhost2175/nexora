import type { Dictionary } from "@/lib/i18n";

export function PricingSection({ dict }: { dict: Dictionary }) {
  return (
    <section
      className="a4-page border-b border-outline-variant/20 py-section-gap"
      id="pricing"
    >
      <h2 className="mb-16 text-center text-headline-lg">
        {dict.pricing.title}
      </h2>
      <div className="glass-card mx-auto max-w-4xl overflow-hidden rounded-3xl">
        <div className="relative overflow-hidden border-b border-outline-variant/20 p-10 text-center sm:p-12">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-container/5 to-transparent" />
          <div className="relative z-10">
            <p className="mb-4 text-label-sm font-semibold uppercase tracking-widest text-primary-container">
              {dict.pricing.badge}
            </p>
            <div className="flex items-baseline justify-center gap-3 text-headline-display text-on-surface">
              <span>{dict.pricing.amount}</span>
              <span className="text-3xl font-medium text-on-surface-variant">
                {dict.pricing.currency}
              </span>
            </div>
            <p className="mx-auto mt-6 max-w-lg text-body-md leading-relaxed text-on-surface-variant">
              {dict.pricing.note}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="border-outline-variant/20 bg-white/40 p-10 sm:p-12 md:border-r">
            <h4 className="mb-8 flex items-center gap-3 text-body-lg font-semibold">
              <span className="material-symbols-outlined rounded-full bg-primary-container/10 p-2 text-primary-container">
                done_all
              </span>
              {dict.pricing.includedTitle}
            </h4>
            <ul className="space-y-5 text-body-md text-on-surface-variant">
              {dict.pricing.included.map((item) => (
                <li key={item} className="flex items-start gap-4">
                  <span className="material-symbols-outlined mt-1 text-sm text-primary-container">
                    check
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface-container-low/30 p-10 sm:p-12">
            <h4 className="mb-8 flex items-center gap-3 text-body-lg font-semibold text-on-surface-variant">
              <span className="material-symbols-outlined rounded-full bg-outline-variant/20 p-2 text-secondary">
                info
              </span>
              {dict.pricing.excludedTitle}
            </h4>
            <ul className="space-y-5 text-body-md text-on-surface-variant/80">
              {dict.pricing.excluded.map((item) => (
                <li key={item} className="flex items-start gap-4">
                  <span className="material-symbols-outlined mt-1 text-sm text-outline-variant">
                    close
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
