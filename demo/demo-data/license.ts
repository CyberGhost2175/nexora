import type { LicenseRenewal } from "@/lib/types";
import { daysAgo, daysFromNow } from "./dates";

/**
 * Демо-лицензия: чисто визуальный мок, без реальной проверки
 * подписи или файлов. Активна, истекает через 340 дней.
 */
export const LICENSE = {
  plan: "Nexora Business",
  // все модули из company.MODULES включены
  enabledModuleKeys: [
    "tickets",
    "maintenance",
    "warehouse",
    "finance",
    "acts",
    "service",
    "map",
    "analytics",
    "mobile",
    "notifications",
  ],
  expiresAt: daysFromNow(340),
  graceExpiredAt: daysAgo(4), // используется в сценарии "грейс-период"
};

export const LICENSE_RENEWALS: LicenseRenewal[] = [
  { date: daysAgo(25), amount: 1440000, status: "paid", period: "12 месяцев" },
  { date: daysAgo(390), amount: 1320000, status: "paid", period: "12 месяцев" },
  { date: daysAgo(755), amount: 660000, status: "paid", period: "6 месяцев" },
];
