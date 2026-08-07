"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDemo } from "@/lib/store";
import { STATUS_LABELS } from "@/lib/status-machine";
import type { TicketStatus } from "@/lib/types";
import { formatDate, money } from "@/lib/format";
import { MASTERS } from "@/demo-data/masters";
import { downloadCsv } from "@/lib/csv";
import { Button, Card, PageHeader } from "@/components/ui";

const PIE_COLORS = [
  "#3b82f6", "#6366f1", "#f59e0b", "#94a3b8", "#a855f7",
  "#06b6d4", "#f97316", "#10b981", "#ef4444",
];

export default function AnalyticsPage() {
  const { tickets } = useDemo();

  // Все цифры считаются из того же стейта заявок, что и дашборд, —
  // поэтому финансы в аналитике и на дашборде всегда сходятся.
  const byStatus = (Object.keys(STATUS_LABELS) as TicketStatus[])
    .map((s) => ({
      name: STATUS_LABELS[s],
      value: tickets.filter((t) => t.status === s).length,
    }))
    .filter((d) => d.value > 0);

  const closed = tickets
    .filter((t) => t.status === "closed" && t.closing && t.closedAt)
    .sort((a, b) => a.closedAt!.localeCompare(b.closedAt!));

  const financeByDay = closed.map((t) => ({
    name: formatDate(t.closedAt!),
    Выручка: t.closing!.revenue,
    "Доход компании": t.closing!.companyIncome,
  }));

  const kpi = MASTERS.map((m) => {
    const taken = tickets.filter((t) => t.assigneeId === m.id);
    const done = taken.filter((t) => t.status === "closed");
    const earned = done.reduce((s, t) => s + (t.closing?.payout ?? 0), 0);
    return { master: m, taken: taken.length, done: done.length, earned };
  }).sort((a, b) => b.earned - a.earned);

  function exportTicketsCsv() {
    downloadCsv(
      "nexora-tickets.csv",
      ["Номер", "Название", "Статус", "Приоритет", "Клиент", "Исполнитель", "Выручка", "Доход компании"],
      tickets.map((t) => [
        t.number,
        t.title,
        STATUS_LABELS[t.status],
        t.priority,
        t.client.name,
        MASTERS.find((m) => m.id === t.assigneeId)?.name ?? "",
        t.closing?.revenue ?? "",
        t.closing?.companyIncome ?? "",
      ]),
    );
  }

  function exportKpiCsv() {
    downloadCsv(
      "nexora-kpi.csv",
      ["Мастер", "Тип", "Взято", "Закрыто", "Заработано"],
      kpi.map((r) => [
        r.master.name,
        r.master.type === "staff" ? "штатный" : "партнёрский",
        r.taken,
        r.done,
        r.earned,
      ]),
    );
  }

  return (
    <div>
      <PageHeader
        title="Аналитика и KPI"
        subtitle="Статусы, финансы и эффективность мастеров"
        actions={
          <>
            <Button variant="secondary" onClick={exportTicketsCsv}>
              Экспорт заявок CSV
            </Button>
            <Button variant="secondary" onClick={exportKpiCsv}>
              Экспорт KPI CSV
            </Button>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-4">
          <h2 className="mb-2 text-sm font-semibold">Заявки по статусам</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byStatus}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {byStatus.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="mb-2 text-sm font-semibold">Финансы по закрытым заявкам</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financeByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${Math.round(Number(v) / 1000)}к`}
                />
                <Tooltip formatter={(v) => money(Number(v))} />
                <Legend />
                <Bar dataKey="Выручка" fill="#2a4070" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Доход компании" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="mt-4 overflow-x-auto">
        <div className="border-b border-slate-100 px-4 py-3 text-sm font-semibold">
          KPI мастеров
        </div>
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs tracking-wide text-slate-400 uppercase">
              <th className="px-4 py-3 font-semibold">Мастер</th>
              <th className="px-4 py-3 font-semibold">Тип</th>
              <th className="px-4 py-3 text-right font-semibold">Взято</th>
              <th className="px-4 py-3 text-right font-semibold">Закрыто</th>
              <th className="px-4 py-3 text-right font-semibold">Заработано</th>
            </tr>
          </thead>
          <tbody>
            {kpi.map((r) => (
              <tr key={r.master.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium">{r.master.name}</td>
                <td className="px-4 py-3 text-slate-500">
                  {r.master.type === "staff" ? "Штатный" : "Партнёрский"}
                </td>
                <td className="px-4 py-3 text-right">{r.taken}</td>
                <td className="px-4 py-3 text-right">{r.done}</td>
                <td className="px-4 py-3 text-right font-semibold">{money(r.earned)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
