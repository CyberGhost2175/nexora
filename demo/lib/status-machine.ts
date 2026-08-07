import type { TicketStatus } from "./types";

/**
 * Статус-модель заявки — конечный автомат.
 * Граф переходов хранится в конфиге: чтобы изменить workflow,
 * достаточно поправить эту таблицу, UI подхватит её автоматически.
 */
export const STATUS_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  new: ["in_progress", "cancelled"],
  in_progress: [
    "awaiting_parts",
    "frozen",
    "in_service",
    "on_approval",
    "cancelled",
  ],
  awaiting_parts: ["in_progress", "frozen", "cancelled"],
  frozen: ["in_progress", "cancelled"],
  in_service: ["in_progress", "on_approval"],
  on_approval: ["closed", "recall"],
  recall: ["in_progress"],
  closed: [],
  cancelled: [],
};

export const STATUS_LABELS: Record<TicketStatus, string> = {
  new: "Новая",
  in_progress: "В работе",
  awaiting_parts: "Ожидает запчастей",
  frozen: "Заморожена",
  in_service: "В сервисе",
  on_approval: "На утверждении",
  recall: "Повторный вызов",
  closed: "Закрыта",
  cancelled: "Отменена",
};

/** Цвета бейджей статусов (Tailwind-классы) */
export const STATUS_COLORS: Record<TicketStatus, string> = {
  new: "bg-blue-50 text-blue-700 ring-blue-600/20",
  in_progress: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  awaiting_parts: "bg-amber-50 text-amber-700 ring-amber-600/20",
  frozen: "bg-slate-100 text-slate-600 ring-slate-500/20",
  in_service: "bg-purple-50 text-purple-700 ring-purple-600/20",
  on_approval: "bg-cyan-50 text-cyan-700 ring-cyan-600/20",
  recall: "bg-orange-50 text-orange-700 ring-orange-600/20",
  closed: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  cancelled: "bg-red-50 text-red-700 ring-red-600/20",
};

export function canTransition(from: TicketStatus, to: TicketStatus): boolean {
  return STATUS_TRANSITIONS[from].includes(to);
}

export function availableTransitions(from: TicketStatus): TicketStatus[] {
  return STATUS_TRANSITIONS[from];
}

export const ACTIVE_STATUSES: TicketStatus[] = [
  "new",
  "in_progress",
  "awaiting_parts",
  "frozen",
  "in_service",
  "on_approval",
  "recall",
];
