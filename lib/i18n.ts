import { notFound } from "next/navigation";

const dictionaries = {
  ru: () => import("@/dictionaries/ru.json").then((m) => m.default),
  kk: () => import("@/dictionaries/kk.json").then((m) => m.default),
};

export const locales = ["ru", "kk"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ru";

export function hasLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["ru"]>>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  if (!hasLocale(locale)) notFound();
  return dictionaries[locale]();
}
