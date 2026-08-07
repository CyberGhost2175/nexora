import type { Act } from "@/lib/types";
import { daysAgo } from "./dates";

/**
 * Акты выполненных работ. Публичная ссылка на акт строится как
 * /act/av-<id>-<фейковый токен> — реальной криптографии в демо нет.
 */
export const ACTS: Act[] = [
  {
    id: "a1",
    number: "АВР-2026-014",
    date: daysAgo(5),
    kind: "repair",
    customer: "ТОО «QazFood Казахстан»",
    customerDetails: "БИН 987654321098, г. Алматы, пр. Абая, 44",
    ticketNumber: "NX-1046",
    partnerId: "p1",
    rows: [
      { name: "Поиск утечки хладагента, перепаковка вальцовки", qty: 1, unit: "усл.", price: 35000 },
      { name: "Вакуумирование и заправка R404a", qty: 1, unit: "усл.", price: 28100 },
      { name: "Фильтр-осушитель 30 г", qty: 1, unit: "шт.", price: 1900 },
    ],
  },
  {
    id: "a2",
    number: "АВР-2026-013",
    date: daysAgo(12),
    kind: "repair",
    customer: "ТОО «MegaMart Retail»",
    customerDetails: "БИН 876543210987, г. Алматы, ул. Гоголя, 58",
    ticketNumber: "NX-1044",
    partnerId: "p2",
    rows: [
      { name: "Замена компрессора морозильного ларя", qty: 1, unit: "усл.", price: 12100 },
      { name: "Компрессор Embraco NEK6214Z", qty: 1, unit: "шт.", price: 78000 },
      { name: "Фильтр-осушитель 30 г", qty: 1, unit: "шт.", price: 1900 },
    ],
  },
  {
    id: "a3",
    number: "АВР-2026-012",
    date: daysAgo(1),
    kind: "maintenance",
    customer: "ТОО «QazFood Казахстан»",
    customerDetails: "БИН 987654321098, г. Алматы, пр. Абая, 44",
    partnerId: "p1",
    rows: [
      { name: "Плановое ТО оборудования, точки сети (11 шт.)", qty: 11, unit: "точка", price: 25000 },
    ],
  },
];

export function actTotal(act: Act): number {
  return act.rows.reduce((sum, row) => sum + row.qty * row.price, 0);
}

/** Фейковый share-токен: без подписи, просто узнаваемый URL для демо */
export function buildShareToken(actId: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `av-${actId}-${rand}`;
}

export function actIdFromToken(token: string): string | undefined {
  const match = token.match(/^av-(a\d+)-/);
  return match?.[1];
}
