import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { AudienceSection } from "@/components/sections/AudienceSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { CoverSection } from "@/components/sections/CoverSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { SolutionSection } from "@/components/sections/SolutionSection";
import { getDictionary, hasLocale } from "@/lib/i18n";
import {
  absoluteUrl,
  buildLanguageAlternates,
  defaultOgImage,
  ogLocaleAlternates,
  ogLocaleMap,
  organization,
} from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);

  const canonical = absoluteUrl(`/${lang}`);

  return {
    title: { absolute: dict.meta.titleDefault },
    description: dict.meta.description,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(""),
    },
    openGraph: {
      type: "website",
      siteName: dict.meta.siteName,
      title: dict.meta.ogTitle,
      description: dict.meta.ogDescription,
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
      title: dict.meta.ogTitle,
      description: dict.meta.ogDescription,
      images: [defaultOgImage.url],
    },
  };
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  const packageOffers = dict.pricing.packages.map((pkg) => ({
    "@type": "Offer",
    name: pkg.name,
    price: pkg.price.replace(/\s/g, ""),
    priceCurrency: "KZT",
    priceValidUntil: "2026-12-31",
    availability: "https://schema.org/InStock",
    url: absoluteUrl(`/${lang}#pricing`),
    description: pkg.audience,
  }));

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: organization.brandName,
    description: dict.meta.description,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "CRM",
    operatingSystem: "Web",
    inLanguage: ["ru", "kk", "en"],
    url: absoluteUrl(`/${lang}`),
    image: defaultOgImage.url,
    offers: packageOffers,
    provider: {
      "@type": "Organization",
      name: organization.brandName,
      url: organization.url,
      telephone: organization.telephone,
      email: dict.contact.email,
    },
    featureList: dict.solution.items.map((item) => item.title),
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: dict.meta.ogTitle,
    provider: {
      "@type": "Organization",
      name: organization.brandName,
      url: organization.url,
      telephone: organization.telephone,
      email: dict.contact.email,
    },
    areaServed: {
      "@type": "Country",
      name: "Kazakhstan",
    },
    offers: packageOffers,
    description: dict.meta.description,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dict.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header dict={dict} lang={lang} />
      <main className="mx-auto w-full max-w-[1400px] px-container-padding lg:px-page-margin">
        <CoverSection dict={dict} />
        <ProblemSection dict={dict} />
        <AudienceSection dict={dict} />
        <HowItWorksSection dict={dict} />
        <SolutionSection dict={dict} />
        <PricingSection dict={dict} />
        <FaqSection dict={dict} />
        <ContactSection dict={dict} lang={lang} />
      </main>
      <Footer dict={dict} lang={lang} />
    </>
  );
}
