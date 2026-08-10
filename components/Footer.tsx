import Link from "next/link";
import { Logo } from "@/components/Logo";
import type { Dictionary, Locale } from "@/lib/i18n";

type Props = {
  dict: Dictionary;
  lang: Locale;
};

const WHATSAPP_URL = "https://wa.me/77750002175";
// TODO: добавить реальную ссылку Instagram, когда появится
const INSTAGRAM_URL = "";

export function Footer({ dict, lang }: Props) {
  return (
    <footer className="glass-card mt-section-gap w-full border-t border-outline-variant/20">
      <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-container-padding py-12 lg:px-page-margin md:grid-cols-3">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <Link href={`/${lang}`} className="shrink-0" aria-label="Nexora">
            <Logo size="footer" />
          </Link>
          <p className="text-body-md text-on-surface-variant">
            {dict.contact.company}
          </p>
          <p className="text-label-sm text-on-surface-variant">
            {dict.footer.rights}
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
          <p className="text-label-sm uppercase tracking-wider text-secondary">
            {dict.footer.socialTitle}
          </p>
          <a
            href={`tel:${dict.contact.phone.replace(/\s/g, "")}`}
            className="text-body-md text-on-surface transition-colors hover:text-primary"
          >
            {dict.contact.phone}
          </a>
          <div className="mt-2 flex flex-wrap justify-center gap-3 md:justify-start">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={dict.footer.whatsappAria}
              className="inline-flex items-center gap-2 rounded-full border border-outline-variant/40 px-4 py-2 text-label-sm text-secondary transition-colors hover:border-primary-container/40 hover:text-primary"
            >
              <span className="material-symbols-outlined text-base">chat</span>
              {dict.footer.whatsapp}
            </a>
            {INSTAGRAM_URL ? (
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={dict.footer.instagramAria}
                className="inline-flex items-center gap-2 rounded-full border border-outline-variant/40 px-4 py-2 text-label-sm text-secondary transition-colors hover:border-primary-container/40 hover:text-primary"
              >
                {dict.footer.instagram}
              </a>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 text-center md:items-end md:text-right">
          <Link
            href={`/${lang}#contact`}
            className="text-label-sm uppercase tracking-wider text-secondary transition-colors hover:text-primary"
          >
            {dict.footer.contact}
          </Link>
          <Link
            href={`/${lang}/privacy`}
            className="text-label-sm uppercase tracking-wider text-secondary transition-colors hover:text-primary"
          >
            {dict.footer.privacy}
          </Link>
          <a
            href="https://nexorasystems.kz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-label-sm uppercase tracking-wider text-secondary transition-colors hover:text-primary"
          >
            {dict.footer.site}
          </a>
        </div>
      </div>
    </footer>
  );
}
