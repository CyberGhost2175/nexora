import { defaultLocale, locales, type Locale } from "@/lib/i18n";

/**
 * Каноничный домен сайта. Используется для metadataBase, sitemap, robots
 * и абсолютных URL в OpenGraph/JSON-LD. Можно переопределить переменной
 * окружения NEXT_PUBLIC_SITE_URL на превью-стендах.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexorasystems.kz"
).replace(/\/$/, "");

/**
 * hreflang-коды для тегов <link rel="alternate"> и Metadata API.
 * ISO-коды: `ru`, `kk` (казахский по BCP-47) + x-default на локаль по умолчанию.
 */
export const hreflangMap: Record<Locale, string> = {
  ru: "ru",
  kk: "kk",
};

/** Абсолютный URL по относительному пути. */
export function absoluteUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
}

/**
 * Строит объект alternates.languages для Metadata API:
 * {
 *   ru: "https://.../ru/...",
 *   kk: "https://.../kk/...",
 *   "x-default": "https://.../ru/...",
 * }
 * pathSuffix — часть после /<lang> (например, "/privacy" или "").
 */
export function buildLanguageAlternates(pathSuffix = ""): Record<string, string> {
  const suffix = pathSuffix.startsWith("/") || pathSuffix === "" ? pathSuffix : `/${pathSuffix}`;
  const entries = locales.reduce<Record<string, string>>((acc, loc) => {
    acc[hreflangMap[loc]] = absoluteUrl(`/${loc}${suffix}`);
    return acc;
  }, {});
  entries["x-default"] = absoluteUrl(`/${defaultLocale}${suffix}`);
  return entries;
}

/** Локаль в формате BCP-47 для OpenGraph (og:locale). */
export const ogLocaleMap: Record<Locale, string> = {
  ru: "ru_RU",
  kk: "kk_KZ",
};

export function ogLocaleAlternates(current: Locale): string[] {
  return locales.filter((l) => l !== current).map((l) => ogLocaleMap[l]);
}

/**
 * Данные организации — единая точка правды для JSON-LD Organization
 * и для контактной информации в структурированной разметке.
 */
export const organization = {
  legalName: "ИП Nexora",
  brandName: "Nexora Systems",
  url: SITE_URL,
  logo: absoluteUrl("/images/logo.png"),
  telephone: "+7 775 000 21 75",
  areaServed: "KZ",
  countryCode: "KZ",
  sameAs: [] as string[],
} as const;

/**
 * Дефолтный OpenGraph/Twitter-баннер. 1200x630, JPG, оптимизирован
 * под соцсети (Facebook, LinkedIn, Telegram, WhatsApp, X/Twitter).
 * Меняется в одном месте — подхватывается на всех страницах.
 */
export const defaultOgImage = {
  url: absoluteUrl("/og/nexora-og.jpg"),
  width: 1200,
  height: 630,
  type: "image/jpeg",
} as const;
