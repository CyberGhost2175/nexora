import type { MasterType } from "./types";

/**
 * Единые правила расчёта денег по заявке.
 * Используются и в анкете закрытия, и в аналитике, и на дашборде —
 * поэтому цифры везде сходятся.
 */
export const PAYOUT_RATES: Record<MasterType, number> = {
  staff: 0.4, // штатный мастер получает 40% прибыли
  partner: 0.5, // партнёрский — 50% прибыли
};

export interface FinanceBreakdown {
  revenue: number;
  partsCost: number;
  profit: number;
  payout: number;
  companyIncome: number;
}

export function calcFinance(
  revenue: number,
  partsCost: number,
  masterType: MasterType,
): FinanceBreakdown {
  const profit = Math.max(0, revenue - partsCost);
  const payout = Math.round(profit * PAYOUT_RATES[masterType]);
  return {
    revenue,
    partsCost,
    profit,
    payout,
    companyIncome: profit - payout,
  };
}
