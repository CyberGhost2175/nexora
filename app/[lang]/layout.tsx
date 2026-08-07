import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/i18n";
import {
  SITE_URL,
  buildLanguageAlternates,
  defaultOgImage,
  absoluteUrl,
  ogLocaleAlternates,
  ogLocaleMap,
  organization,
} from "@/lib/seo";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export async function generateStaticParams() {
  return [{ lang: "ru" }, { lang: "kk" }];
}

export const viewport: Viewport = {
  themeColor: "#3648f1",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);

  const canonical = absoluteUrl(`/${lang}`);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.meta.titleDefault,
      template: dict.meta.titleTemplate,
    },
    description: dict.meta.description,
    applicationName: dict.meta.siteName,
    keywords: dict.meta.keywords,
    authors: [{ name: dict.meta.siteName, url: SITE_URL }],
    creator: dict.meta.siteName,
    publisher: dict.meta.siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: true,
    },
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
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.png", type: "image/png" },
      ],
      apple: "/icon.png",
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: organization.brandName,
    legalName: organization.legalName,
    url: organization.url,
    logo: organization.logo,
    telephone: organization.telephone,
    areaServed: organization.areaServed,
    address: {
      "@type": "PostalAddress",
      addressCountry: organization.countryCode,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: organization.telephone,
        contactType: "sales",
        areaServed: organization.areaServed,
        availableLanguage: ["ru", "kk"],
      },
    ],
    ...(organization.sameAs.length > 0 ? { sameAs: organization.sameAs } : {}),
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: organization.brandName,
    url: organization.url,
    inLanguage: lang,
  };

  return (
    <html lang={lang} className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col font-sans text-on-surface">
        {children}
      </body>
    </html>
  );
}
