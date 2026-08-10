import type { Dictionary } from "@/lib/i18n";

type Package = Dictionary["pricing"]["packages"][number];
type RowKey = keyof Dictionary["pricing"]["labels"];

const ROW_KEYS: RowKey[] = [
  "audience",
  "includes",
  "mobile",
  "addons",
  "training",
  "support",
];

export function PricingSection({ dict }: { dict: Dictionary }) {
  const pricing = dict.pricing;
  const labels = pricing.labels;
  const packages = pricing.packages ?? [];

  if (!labels || packages.length === 0) {
    return null;
  }

  return (
    <section
      className="a4-page border-b border-outline-variant/20 py-section-gap"
      id="pricing"
    >
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <h2 className="mb-4 text-headline-lg">{pricing.title}</h2>
        <p className="text-body-lg text-on-surface-variant">{pricing.subtitle}</p>
      </div>

      {/* Mobile: stacked cards */}
      <div className="mb-8 grid grid-cols-1 gap-element-gap lg:hidden">
        {packages.map((pkg) => (
          <PackageCard
            key={pkg.name}
            pkg={pkg}
            labels={labels}
            fromPrefix={pricing.fromPrefix}
            currency={pricing.currency}
          />
        ))}
      </div>

      {/* Desktop: comparison table */}
      <div className="glass-card mb-8 hidden overflow-hidden rounded-3xl lg:block">
        <div className="grid grid-cols-[minmax(180px,0.9fr)_1fr_1fr] border-b border-outline-variant/20">
          <div className="bg-surface-container-low/40 p-6" />
          {packages.map((pkg) => {
            const featured = "featured" in pkg && Boolean(pkg.featured);
            return (
              <div
                key={pkg.name}
                className={`border-l border-outline-variant/20 p-8 text-center ${
                  featured ? "bg-primary-container/[0.04]" : ""
                }`}
              >
                <h3 className="mb-4 text-headline-md text-on-surface">
                  {pkg.name}
                </h3>
                <p className="flex items-baseline justify-center gap-2">
                  <span className="text-label-sm uppercase tracking-wide text-secondary">
                    {pricing.fromPrefix}
                  </span>
                  <span className="text-headline-lg text-on-surface">
                    {pkg.price}
                  </span>
                  <span className="text-body-lg text-on-surface-variant">
                    {pricing.currency}
                  </span>
                </p>
              </div>
            );
          })}
        </div>

        {ROW_KEYS.map((key, index) => (
          <div
            key={key}
            className={`grid grid-cols-[minmax(180px,0.9fr)_1fr_1fr] ${
              index < ROW_KEYS.length - 1
                ? "border-b border-outline-variant/20"
                : ""
            }`}
          >
            <div className="bg-surface-container-low/40 px-6 py-6 text-label-sm font-semibold uppercase tracking-wide text-secondary">
              {labels[key]}
            </div>
            {packages.map((pkg) => {
              const featured = "featured" in pkg && Boolean(pkg.featured);
              return (
                <div
                  key={`${pkg.name}-${key}`}
                  className={`border-l border-outline-variant/20 px-8 py-6 text-body-md leading-relaxed text-on-surface-variant ${
                    featured ? "bg-primary-container/[0.04]" : ""
                  } ${key === "support" ? "font-semibold text-on-surface" : ""}`}
                >
                  {pkg[key]}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <p className="mx-auto max-w-2xl text-center text-body-md text-on-surface-variant">
        {pricing.customNote}
      </p>
    </section>
  );
}

function PackageCard({
  pkg,
  labels,
  fromPrefix,
  currency,
}: {
  pkg: Package;
  labels: Dictionary["pricing"]["labels"];
  fromPrefix: string;
  currency: string;
}) {
  const featured = "featured" in pkg && Boolean(pkg.featured);

  return (
    <div
      className={`glass-card flex flex-col rounded-3xl p-8 ${
        featured ? "ring-2 ring-primary-container/20" : ""
      }`}
    >
      <h3 className="mb-3 text-headline-md text-on-surface">{pkg.name}</h3>
      <div className="mb-8 flex items-baseline gap-2">
        <span className="text-label-sm uppercase tracking-wide text-secondary">
          {fromPrefix}
        </span>
        <span className="text-headline-lg text-on-surface">{pkg.price}</span>
        <span className="text-body-lg text-on-surface-variant">{currency}</span>
      </div>

      <dl className="space-y-5">
        {ROW_KEYS.map((key) => (
          <div key={key}>
            <dt className="mb-1 text-label-sm font-semibold uppercase tracking-wide text-secondary">
              {labels[key]}
            </dt>
            <dd
              className={`text-body-md leading-relaxed text-on-surface-variant ${
                key === "support" ? "font-semibold text-on-surface" : ""
              }`}
            >
              {pkg[key]}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
