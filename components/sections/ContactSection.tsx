"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/lib/i18n";

/** Kazakhstan mobile: +7 7XX XXX XX XX */
function formatKzPhone(value: string): string {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("8")) {
    digits = `7${digits.slice(1)}`;
  }
  if (!digits.startsWith("7")) {
    digits = `7${digits}`;
  }

  digits = digits.slice(0, 11);
  const rest = digits.slice(1);

  let formatted = "+7";
  if (rest.length > 0) formatted += ` ${rest.slice(0, 3)}`;
  if (rest.length > 3) formatted += ` ${rest.slice(3, 6)}`;
  if (rest.length > 6) formatted += ` ${rest.slice(6, 8)}`;
  if (rest.length > 8) formatted += ` ${rest.slice(8, 10)}`;

  return formatted;
}

function isValidKzPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return /^77\d{9}$/.test(digits);
}

export function ContactSection({
  dict,
  lang = "ru",
}: {
  dict: Dictionary;
  lang?: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [phone, setPhone] = useState("+7 ");
  const [error, setError] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);

  const handleDemo = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValidKzPhone(phone)) {
      setError(true);
      return;
    }

    setError(false);
    setSendError(false);
    setSending(true);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          source: "site / demo form",
          lang,
        }),
      });

      if (!res.ok) {
        setSendError(true);
        return;
      }

      setSubmitted(true);
    } catch {
      setSendError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      className="a4-page flex items-center justify-center py-section-gap"
      id="contact"
    >
      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-container p-8 text-center text-white shadow-2xl sm:p-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-60" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10">
          <h2 className="mb-8 text-headline-display">{dict.contact.title}</h2>
          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-primary-fixed">
            {dict.contact.subtitle}
          </p>

          <div className="mb-16 flex flex-col justify-center gap-6 md:flex-row md:items-center">
            <a
              href={`tel:${dict.contact.phone.replace(/\s/g, "")}`}
              aria-label={dict.contact.phoneAria}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-10 py-4 text-label-sm font-bold text-primary-container transition-all duration-300 hover:bg-surface hover:shadow-xl"
            >
              <span className="material-symbols-outlined">call</span>
              {dict.contact.phone}
            </a>

            {submitted ? (
              <div className="inline-flex items-center justify-center gap-3 rounded-full border border-white/30 bg-white/10 px-10 py-4 text-label-sm font-bold backdrop-blur-sm">
                <span className="material-symbols-outlined">check_circle</span>
                {dict.contact.submitted}
              </div>
            ) : (
              <form
                onSubmit={handleDemo}
                className="flex w-full max-w-md flex-col gap-2"
              >
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="tel"
                    name="phone"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    value={phone}
                    disabled={sending}
                    onChange={(e) => {
                      setPhone(formatKzPhone(e.target.value));
                      setError(false);
                      setSendError(false);
                    }}
                    onFocus={() => {
                      if (phone === "" || phone === "+") setPhone("+7 ");
                    }}
                    placeholder={dict.contact.placeholder}
                    aria-invalid={error}
                    className={`min-w-0 flex-1 rounded-full border bg-white/10 px-5 py-4 text-label-sm text-white placeholder:text-white/60 outline-none backdrop-blur-sm focus:border-white/60 disabled:opacity-60 ${
                      error ? "border-red-300" : "border-white/30"
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-4 text-label-sm font-bold backdrop-blur-sm transition-all duration-300 hover:bg-white/20 disabled:cursor-wait disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined">mail</span>
                    {sending ? "…" : dict.contact.requestDemo}
                  </button>
                </div>
                {error ? (
                  <p className="px-2 text-left text-sm text-red-200">
                    {dict.contact.phoneError}
                  </p>
                ) : null}
                {sendError ? (
                  <p className="px-2 text-left text-sm text-red-200">
                    {dict.contact.sendError}
                  </p>
                ) : null}
              </form>
            )}
          </div>

          <div className="grid grid-cols-1 gap-8 border-t border-white/20 pt-10 text-left text-body-md text-primary-fixed md:grid-cols-2">
            <div>
              <p className="mb-2 text-lg font-semibold text-white">
                {dict.contact.company}
              </p>
              <p>{dict.contact.director}</p>
            </div>
            <div className="md:text-right">
              <p className="mb-1 opacity-90">{dict.contact.geo}</p>
              <p className="opacity-90">{dict.contact.docs}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
