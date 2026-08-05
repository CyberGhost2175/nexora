import type { Dictionary } from "@/lib/i18n";

export function ProblemSection({ dict }: { dict: Dictionary }) {
  return (
    <section className="a4-page border-b border-outline-variant/20 py-section-gap">
      <h2 className="mx-auto mb-16 max-w-2xl text-center text-headline-lg">
        {dict.problem.title}
      </h2>
      <div className="grid grid-cols-1 gap-element-gap md:grid-cols-2 lg:grid-cols-3">
        {dict.problem.items.map((item) => (
          <div
            key={item.title}
            className="glass-card rounded-2xl p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-error-container/30 text-error">
              <span className="material-symbols-outlined text-3xl">
                {item.icon}
              </span>
            </div>
            <h3 className="mb-4 text-headline-md text-on-surface">
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
