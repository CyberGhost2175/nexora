import type { Dictionary } from "@/lib/i18n";

export function AudienceSection({ dict }: { dict: Dictionary }) {
  return (
    <section
      className="a4-page border-b border-outline-variant/20 py-section-gap"
      id="audience"
    >
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <h2 className="mb-4 text-headline-lg">{dict.audience.title}</h2>
        <p className="text-body-lg text-on-surface-variant">
          {dict.audience.subtitle}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-element-gap sm:grid-cols-2 lg:grid-cols-3">
        {dict.audience.items.map((item) => (
          <div
            key={item.title}
            className="glass-card rounded-2xl p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-container/10 text-primary-container">
              <span className="material-symbols-outlined text-3xl">
                {item.icon}
              </span>
            </div>
            <h3 className="mb-3 text-headline-md text-on-surface">
              {item.title}
            </h3>
            <p className="text-body-md leading-relaxed text-on-surface-variant">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
