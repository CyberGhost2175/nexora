import type { Dictionary } from "@/lib/i18n";

export function HowItWorksSection({ dict }: { dict: Dictionary }) {
  return (
    <section
      className="a4-page border-b border-outline-variant/20 py-section-gap"
      id="product"
    >
      <div className="mx-auto mb-6 max-w-2xl text-center">
        <h2 className="mb-4 text-headline-lg">{dict.howItWorks.title}</h2>
        <p className="text-body-lg text-on-surface-variant">
          {dict.howItWorks.subtitle}
        </p>
      </div>

      <div className="mb-16 flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-container/10 px-5 py-2 text-label-sm uppercase tracking-wide text-primary-container">
          <span className="material-symbols-outlined text-base">schedule</span>
          {dict.howItWorks.timeline}
        </span>
      </div>

      <div className="relative grid grid-cols-1 gap-element-gap md:grid-cols-2 xl:grid-cols-4">
        <div
          className="pointer-events-none absolute top-10 right-8 left-8 hidden h-px bg-gradient-to-r from-transparent via-primary-container/30 to-transparent xl:block"
          aria-hidden
        />
        {dict.howItWorks.steps.map((step, index) => (
          <div
            key={step.title}
            className="glass-card relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-label-sm font-bold text-white">
                {step.step}
              </span>
              {index < dict.howItWorks.steps.length - 1 ? (
                <span className="material-symbols-outlined text-primary-container/40 xl:hidden">
                  arrow_forward
                </span>
              ) : null}
            </div>
            <h3 className="mb-3 text-headline-md text-on-surface">
              {step.title}
            </h3>
            <p className="text-body-md leading-relaxed text-on-surface-variant">
              {step.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
