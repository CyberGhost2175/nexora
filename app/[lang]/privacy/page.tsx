import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getDictionary, hasLocale } from "@/lib/i18n";
import {
  absoluteUrl,
  buildLanguageAlternates,
  defaultOgImage,
  ogLocaleAlternates,
  ogLocaleMap,
} from "@/lib/seo";

export async function generateStaticParams() {
  return [{ lang: "ru" }, { lang: "kk" }];
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);

  const canonical = absoluteUrl(`/${lang}/privacy`);

  return {
    title: dict.privacy.metaTitle,
    description: dict.privacy.metaDescription,
    alternates: {
      canonical,
      languages: buildLanguageAlternates("/privacy"),
    },
    openGraph: {
      type: "article",
      siteName: dict.meta.siteName,
      title: `${dict.privacy.metaTitle} — ${dict.meta.siteName}`,
      description: dict.privacy.metaDescription,
      url: canonical,
      locale: ogLocaleMap[lang],
      alternateLocale: ogLocaleAlternates(lang),
      images: [
        {
          url: defaultOgImage.url,
          width: defaultOgImage.width,
          height: defaultOgImage.height,
          type: defaultOgImage.type,
          alt: dict.meta.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${dict.privacy.metaTitle} — ${dict.meta.siteName}`,
      description: dict.privacy.metaDescription,
      images: [defaultOgImage.url],
    },
  };
}

export default async function PrivacyPage({
  params,
}: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: dict.privacy.breadcrumbHome,
        item: absoluteUrl(`/${lang}`),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: dict.privacy.breadcrumbPrivacy,
        item: absoluteUrl(`/${lang}/privacy`),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header dict={dict} lang={lang} />
      <main className="mx-auto w-full max-w-[1400px] px-container-padding py-section-gap lg:px-page-margin">
        <div className="mb-12 max-w-3xl">
          <p className="mb-4 text-label-sm uppercase tracking-wider text-primary">
            Nexora Systems
          </p>
          <h1 className="mb-4 text-headline-display text-on-surface">
            {dict.privacy.title}
          </h1>
          <p className="mb-2 text-label-sm text-secondary">{dict.privacy.updated}</p>
          <p className="max-w-2xl border-l-4 border-primary pl-6 text-body-lg text-on-surface-variant">
            {dict.privacy.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-element-gap md:grid-cols-2">
          {dict.privacy.sections.map((section) => (
            <article
              key={section.title}
              className="glass-card rounded-2xl p-8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:p-10"
            >
              <h2 className="mb-4 text-headline-md text-on-surface">
                {section.title}
              </h2>
              <p className="text-body-md leading-relaxed text-on-surface-variant">
                {section.text}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-14">
          <Link
            href={`/${lang}`}
            className="inline-flex rounded-full bg-primary-container px-8 py-3.5 text-label-sm text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:shadow-xl"
          >
            {dict.privacy.back}
          </Link>
        </div>
      </main>
      <Footer dict={dict} lang={lang} />
    </>
  );
}
