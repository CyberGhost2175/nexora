"use client";

import { useRef } from "react";
import { useDemo } from "@/lib/store";
import type { LicenseScenario } from "@/lib/types";
import { LICENSE, LICENSE_RENEWALS } from "@/demo-data/license";
import { MODULES } from "@/demo-data/company";
import { daysUntil, formatDate, money } from "@/lib/format";
import { Button, Card, PageHeader } from "@/components/ui";

/**
 * Страница лицензии — чисто визуальный мок для демонстрации UX.
 * Никакой реальной проверки подписи или содержимого файлов здесь нет.
 */
export default function LicensePage() {
  const { licenseScenario, setLicenseScenario, uploadLicense } = useDemo();
  const fileRef = useRef<HTMLInputElement>(null);

  const daysLeft = daysUntil(LICENSE.expiresAt);

  const badge = {
    active: {
      cls: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
      label: `Активна · истекает через ${daysLeft} дней`,
    },
    grace: {
      cls: "bg-amber-50 text-amber-700 ring-amber-600/20",
      label: "Истекает: действует грейс-период",
    },
    restricted: {
      cls: "bg-red-50 text-red-700 ring-red-600/20",
      label: "Истёк грейс-период · функционал ограничен",
    },
  }[licenseScenario];

  return (
    <div>
      <PageHeader
        title="Лицензия"
        subtitle="Настройки → Лицензия и модули тенанта"
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Card className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  Тариф
                </div>
                <div className="mt-1 text-lg font-semibold">{LICENSE.plan}</div>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold ring-1 ring-inset ${badge.cls}`}
              >
                ● {badge.label}
              </span>
            </div>
            <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="text-xs text-slate-400">
                  Окончание текущего периода
                </div>
                <div className="mt-0.5 font-semibold">
                  {formatDate(LICENSE.expiresAt)}
                </div>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="text-xs text-slate-400">Загрузка лицензии</div>
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      uploadLicense();
                      e.target.value = "";
                    }
                  }}
                />
                <Button
                  variant="secondary"
                  className="mt-1.5"
                  onClick={() => fileRef.current?.click()}
                >
                  Загрузить файл лицензии
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-semibold">Модули, включённые в лицензию</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {MODULES.map((m) => {
                const enabled = (LICENSE.enabledModuleKeys as readonly string[]).includes(m.key);
                return (
                  <label
                    key={m.key}
                    className="flex items-center gap-2.5 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={enabled}
                      readOnly
                      className="h-4 w-4 accent-brand-700"
                    />
                    {m.label}
                  </label>
                );
              })}
            </div>
          </Card>

          <Card>
            <div className="border-b border-slate-100 px-5 py-3 text-sm font-semibold">
              История продлений
            </div>
            {LICENSE_RENEWALS.map((r, i) => (
              <div
                key={i}
                className="flex flex-wrap items-center gap-3 border-b border-slate-50 px-5 py-3 last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">
                    Продление на {r.period}
                  </div>
                  <div className="text-xs text-slate-400">{formatDate(r.date)}</div>
                </div>
                <div className="text-sm font-semibold">{money(r.amount)}</div>
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  Оплачено
                </span>
              </div>
            ))}
          </Card>
        </div>

        {/* Демо-тумблер сценария: только для показа стенда на звонке */}
        <Card className="h-fit p-5">
          <h2 className="text-sm font-semibold">Сценарий демонстрации</h2>
          <p className="mt-1 text-xs text-slate-500">
            Переключатель существует только в демо-режиме: показывает клиенту,
            как система ведёт себя при истечении лицензии. Баннер появится на
            дашборде.
          </p>
          <div className="mt-3 space-y-2">
            {(
              [
                ["active", "Лицензия активна"],
                ["grace", "Грейс-период (жёлтый баннер)"],
                ["restricted", "Ограниченный режим (красный баннер)"],
              ] as [LicenseScenario, string][]
            ).map(([value, label]) => (
              <label
                key={value}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition ${
                  licenseScenario === value
                    ? "border-brand-600 bg-brand-50 font-medium"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="license-scenario"
                  checked={licenseScenario === value}
                  onChange={() => setLicenseScenario(value)}
                  className="accent-brand-700"
                />
                {label}
              </label>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
