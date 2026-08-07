const nf = new Intl.NumberFormat("ru-RU");

export function money(value: number): string {
  return `${nf.format(value)} ₸`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** "2 ч 15 мин" до дедлайна или "просрочено на 3 ч" */
export function timeToDeadline(deadline: string): {
  label: string;
  overdue: boolean;
} {
  const diffMs = new Date(deadline).getTime() - Date.now();
  const overdue = diffMs < 0;
  const abs = Math.abs(diffMs);
  const hours = Math.floor(abs / 3_600_000);
  const minutes = Math.floor((abs % 3_600_000) / 60_000);
  const core =
    hours >= 24
      ? `${Math.floor(hours / 24)} д ${hours % 24} ч`
      : `${hours} ч ${minutes} мин`;
  return { label: overdue ? `просрочено на ${core}` : core, overdue };
}

export function daysUntil(iso: string): number {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}
