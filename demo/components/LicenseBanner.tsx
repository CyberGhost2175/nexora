"use client";

import Link from "next/link";
import { useDemo } from "@/lib/store";
import { LICENSE } from "@/demo-data/license";
import { formatDate } from "@/lib/format";

/**
 * Баннер на дашборде при проблемах с лицензией.
 * Сценарий переключается на странице Настройки → Лицензия (демо-тумблер).
 */
export function LicenseBanner() {
  const { licenseScenario } = useDemo();

  if (licenseScenario === "active") return null;

  if (licenseScenario === "grace") {
    return (
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-lg">⚠️</span>
          <div>
            <div className="text-sm font-semibold text-amber-900">
              Лицензия истекла, продлите до {formatDate(LICENSE.graceExpiredAt)}
            </div>
            <div className="text-xs text-amber-700">
              Действует грейс-период. После его окончания функционал будет
              ограничен.
            </div>
          </div>
        </div>
        <Link
          href="/settings/license"
          className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-amber-600"
        >
          Перейти к продлению
        </Link>
      </div>
    );
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-300 bg-red-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-lg">⛔</span>
        <div>
          <div className="text-sm font-semibold text-red-900">
            Функционал ограничен, продлите лицензию
          </div>
          <div className="text-xs text-red-700">
            Грейс-период истёк. Создание заявок и отчёты недоступны.
          </div>
        </div>
      </div>
      <Link
        href="/settings/license"
        className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-red-500"
      >
        Перейти к продлению
      </Link>
    </div>
  );
}
