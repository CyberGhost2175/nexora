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
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [phone, setPhone] = useState("+7 ");
  const [error, setError] = useState<"phone" | "company" | null>(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);

  const handleDemo = async (e: FormEvent) => {
    e.preventDefault();

    if (!company.trim()) {
      setError("company");
      return;
    }
    if (!isValidKzPhone(phone)) {
      setError("phone");
      return;
    }

    setError(null);
    setSendError(false);
    setSending(true);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          company: company.trim(),
          industry: industry.trim(),
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

          {submitted ? (
            <div className="mb-16 inline-flex items-center justify-center gap-3 rounded-full border border-white/30 bg-white/10 px-10 py-4 text-label-sm font-bold backdrop-blur-sm">
              <span className="material-symbols-outlined">check_circle</span>
              {dict.contact.submitted}
            </div>
          ) : (
            <form
              onSubmit={handleDemo}
              className="mx-auto mb-16 flex w-full max-w-xl flex-col gap-3 text-left"
            >
              <label className="sr-only" htmlFor="lead-company">
                {dict.contact.companyLabel}
              </label>
              <input
                id="lead-company"
                type="text"
                name="company"
                autoComplete="organization"
                required
                value={company}
                disabled={sending}
                onChange={(e) => {
                  setCompany(e.target.value);
                  setError(null);
                  setSendError(false);
                }}
                placeholder={dict.contact.companyPlaceholder}
                aria-invalid={error === "company"}
                className={`w-full rounded-2xl border bg-white/10 px-5 py-4 text-label-sm text-white placeholder:text-white/60 outline-none backdrop-blur-sm focus:border-white/60 disabled:opacity-60 ${
                  error === "company" ? "border-red-300" : "border-white/30"
                }`}
              />

              <label className="sr-only" htmlFor="lead-industry">
                {dict.contact.industryLabel}
              </label>
              <input
                id="lead-industry"
                type="text"
                name="industry"
                value={industry}
                disabled={sending}
                onChange={(e) => {
                  setIndustry(e.target.value);
                  setSendError(false);
                }}
                placeholder={dict.contact.industryPlaceholder}
                className="w-full rounded-2xl border border-white/30 bg-white/10 px-5 py-4 text-label-sm text-white placeholder:text-white/60 outline-none backdrop-blur-sm focus:border-white/60 disabled:opacity-60"
              />

              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="sr-only" htmlFor="lead-phone">
                  {dict.contact.phoneLabel}
                </label>
                <input
                  id="lead-phone"
                  type="tel"
                  name="phone"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  value={phone}
                  disabled={sending}
                  onChange={(e) => {
                    setPhone(formatKzPhone(e.target.value));
                    setError(null);
                    setSendError(false);
                  }}
                  onFocus={() => {
                    if (phone === "" || phone === "+") setPhone("+7 ");
                  }}
                  placeholder={dict.contact.placeholder}
                  aria-invalid={error === "phone"}
                  className={`min-w-0 flex-1 rounded-full border bg-white/10 px-5 py-4 text-label-sm text-white placeholder:text-white/60 outline-none backdrop-blur-sm focus:border-white/60 disabled:opacity-60 ${
                    error === "phone" ? "border-red-300" : "border-white/30"
                  }`}
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-4 text-label-sm font-bold backdrop-blur-sm transition-all duration-300 hover:bg-white/20 disabled:cursor-wait disabled:opacity-60"
                >
                  <span className="material-symbols-outlined">send</span>
                  {sending ? "…" : dict.contact.requestDemo}
                </button>
              </div>

              {error === "company" ? (
                <p className="px-2 text-sm text-red-200">
                  {dict.contact.companyError}
                </p>
              ) : null}
              {error === "phone" ? (
                <p className="px-2 text-sm text-red-200">
                  {dict.contact.phoneError}
                </p>
              ) : null}
              {sendError ? (
                <p className="px-2 text-sm text-red-200">
                  {dict.contact.sendError}
                </p>
              ) : null}
            </form>
          )}

          <div className="border-t border-white/20 pt-10 text-body-md text-primary-fixed">
            <p className="mb-1 opacity-90">{dict.contact.geo}</p>
            <p className="opacity-90">{dict.contact.docs}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
