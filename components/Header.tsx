"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import type { Dictionary, Locale } from "@/lib/i18n";

type Props = {
  dict: Dictionary;
  lang: Locale;
};

export function Header({ dict, lang }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { href: `/${lang}#product`, label: dict.nav.product },
    { href: `/${lang}#services`, label: dict.nav.services },
    { href: `/${lang}#pricing`, label: dict.nav.pricing },
    { href: `/${lang}#contact`, label: dict.nav.contact },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-outline-variant/20 transition-shadow duration-300 print:hidden ${
        scrolled ? "glass-card shadow-sm" : "glass-card"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 px-container-padding py-4 lg:px-page-margin">
        <Link
          href={`/${lang}`}
          className="shrink-0"
          onClick={() => setOpen(false)}
          aria-label="Nexora"
        >
          <Logo size="header" priority />
        </Link>

        <nav className="hidden items-center gap-8 text-[0.8125rem] font-medium uppercase tracking-[0.08em] text-secondary lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors duration-200 hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitch lang={lang} dict={dict} />
          <a
            href={`/${lang}#contact`}
            className="rounded-full bg-primary-container px-5 py-2.5 text-label-sm text-white transition-all duration-200 hover:bg-primary hover:shadow-lg"
          >
            {dict.contact.requestDemo}
          </a>
        </div>

        <button
          type="button"
          className="text-on-surface lg:hidden"
          aria-expanded={open}
          aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="material-symbols-outlined">
            {open ? "close" : "menu"}
          </span>
        </button>
      </div>

      <div
        className={`border-t border-outline-variant/20 bg-surface-container-lowest/95 backdrop-blur-md lg:hidden ${
          open ? "block" : "hidden"
        }`}
      >
        <nav className="mx-auto flex max-w-[1400px] flex-col gap-1 px-container-padding py-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-xl px-4 py-3 text-label-sm uppercase tracking-wider text-secondary transition-colors hover:bg-surface-container hover:text-primary"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="mt-3 flex items-center justify-between gap-3 px-1">
            <LanguageSwitch lang={lang} dict={dict} />
            <a
              href={`/${lang}#contact`}
              onClick={() => setOpen(false)}
              className="rounded-full bg-primary-container px-5 py-2.5 text-label-sm text-white transition-all hover:bg-primary"
            >
              {dict.contact.requestDemo}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

function LanguageSwitch({ lang, dict }: Props) {
  return (
    <div className="flex items-center rounded-full border border-outline-variant/40 bg-white/70 p-1 text-label-sm">
      <Link
        href="/ru"
        className={`rounded-full px-3 py-1.5 transition-colors ${
          lang === "ru"
            ? "bg-primary-container text-white"
            : "text-secondary hover:text-primary"
        }`}
        hrefLang="ru"
      >
        {dict.lang.ru}
      </Link>
      <Link
        href="/kk"
        className={`rounded-full px-3 py-1.5 transition-colors ${
          lang === "kk"
            ? "bg-primary-container text-white"
            : "text-secondary hover:text-primary"
        }`}
        hrefLang="kk"
      >
        {dict.lang.kk}
      </Link>
    </div>
  );
}
