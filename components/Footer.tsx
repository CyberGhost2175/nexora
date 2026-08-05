import Link from "next/link";
import { Logo } from "@/components/Logo";
import type { Dictionary, Locale } from "@/lib/i18n";

type Props = {
  dict: Dictionary;
  lang: Locale;
};

export function Footer({ dict, lang }: Props) {
  return (
    <footer className="glass-card mt-section-gap w-full border-t border-outline-variant/20">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-between gap-6 px-container-padding py-10 lg:px-page-margin md:flex-row">
        <Link href={`/${lang}#proposal`} className="shrink-0" aria-label="Nexora">
          <Logo size="footer" />
        </Link>

        <div className="flex flex-wrap justify-center gap-6 text-label-sm uppercase tracking-wider text-secondary">
          <Link
            href={`/${lang}#contact`}
            className="transition-colors hover:text-primary"
          >
            {dict.footer.contact}
          </Link>
          <a
            href="https://nexorasystems.kz"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-primary"
          >
            {dict.footer.site}
          </a>
          <Link
            href={`/${lang}/privacy`}
            className="transition-colors hover:text-primary"
          >
            {dict.footer.privacy}
          </Link>
        </div>

        <p className="text-center text-label-sm text-on-surface-variant md:text-right">
          {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}
