import Image from "next/image";
import type { Dictionary } from "@/lib/i18n";

export function SolutionSection({ dict }: { dict: Dictionary }) {
  return (
    <section
      className="a4-page border-b border-outline-variant/20 py-section-gap"
      id="services"
    >
      <div className="grid items-start gap-16 lg:grid-cols-2">
        <div>
          <div className="mb-12">
            <span className="mb-6 inline-block rounded-full bg-primary-container/10 px-4 py-1.5 text-label-sm uppercase tracking-wide text-primary-container">
              {dict.solution.badge}
            </span>
            <h2 className="mb-8 text-headline-lg text-on-surface">
              {dict.solution.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-y-10">
            {dict.solution.items.map((item) => (
              <div key={item.title} className="flex items-start gap-6">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-container/10">
                  <span
                    className="material-symbols-outlined text-lg text-primary-container"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check
                  </span>
                </div>
                <div>
                  <h4 className="mb-2 text-body-lg font-semibold">
                    {item.title}
                  </h4>
                  <p className="text-body-md leading-relaxed text-on-surface-variant">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sticky top-32 hidden h-[640px] w-full lg:block xl:h-[760px]">
          <div className="relative h-full w-full overflow-hidden rounded-3xl border border-outline-variant/20 shadow-2xl">
            <Image
              src="/images/solution-nexora.jpg"
              alt={dict.solution.imageAlt}
              fill
              className="object-cover object-[center_30%]"
              sizes="50vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
