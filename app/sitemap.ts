import type { MetadataRoute } from "next";
import { defaultLocale, locales } from "@/lib/i18n";
import { SITE_URL, absoluteUrl, hreflangMap } from "@/lib/seo";

const routes = ["", "/privacy"] as const;

function languageAlternates(pathSuffix: string): Record<string, string> {
  const entries = locales.reduce<Record<string, string>>((acc, loc) => {
    acc[hreflangMap[loc]] = absoluteUrl(`/${loc}${pathSuffix}`);
    return acc;
  }, {});
  entries["x-default"] = absoluteUrl(`/${defaultLocale}${pathSuffix}`);
  return entries;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const rootEntry: MetadataRoute.Sitemap[number] = {
    url: SITE_URL,
    lastModified,
    changeFrequency: "monthly",
    priority: 1,
    alternates: {
      languages: languageAlternates(""),
    },
  };

  const localizedEntries: MetadataRoute.Sitemap = routes.flatMap((suffix) =>
    locales.map((locale) => ({
      url: absoluteUrl(`/${locale}${suffix}`),
      lastModified,
      changeFrequency: suffix === "" ? "monthly" : "yearly",
      priority: suffix === "" ? 1 : 0.4,
      alternates: {
        languages: languageAlternates(suffix),
      },
    })),
  );

  return [rootEntry, ...localizedEntries];
}
