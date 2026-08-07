/**
 * Все даты фикстур считаются относительно текущего момента,
 * чтобы демо всегда выглядело "живым" (дедлайны, просрочки, сроки лицензии).
 */
export function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3_600_000).toISOString();
}

export function hoursFromNow(h: number): string {
  return new Date(Date.now() + h * 3_600_000).toISOString();
}

export function daysAgo(d: number): string {
  return new Date(Date.now() - d * 86_400_000).toISOString();
}

export function daysFromNow(d: number): string {
  return new Date(Date.now() + d * 86_400_000).toISOString();
}
