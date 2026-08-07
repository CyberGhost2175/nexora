"use client";

import Link from "next/link";
import { useDemo } from "@/lib/store";
import { ACTIVE_STATUSES } from "@/lib/status-machine";
import { money, timeToDeadline, formatDateTime } from "@/lib/format";
import { MASTERS } from "@/demo-data/masters";
import {
  Card,
  PageHeader,
  PriorityBadge,
  StatCard,
  StatusBadge,
} from "@/components/ui";
import { LicenseBanner } from "@/components/LicenseBanner";

export default function DashboardPage() {
  const { role, tickets, visibleTickets, currentUserName } = useDemo();
  const isOffice = role === "admin" || role === "manager";

  if (!isOffice) {
    // Дашборд мастера: свои задачи на сегодня
    const mine = visibleTickets.filter((t) =>
      ACTIVE_STATUSES.includes(t.status),
    );
    return (
      <div>
        <PageHeader
          title={`Мои задачи — ${currentUserName}`}
          subtitle="Активные и предложенные заявки на сегодня"
        />
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard label="Активных заявок" value={mine.length} />
          <StatCard
            label="Просроченных"
            value={mine.filter((t) => timeToDeadline(t.deadline).overdue).length}
            tone="danger"
          />
          <StatCard
            label="Предложено мне"
            value={visibleTickets.filter((t) => t.proposedToId).length}
          />
        </div>
        <Card>
          {mine.map((t) => {
            const dl = timeToDeadline(t.deadline);
            return (
              <Link
                key={t.id}
                href={`/tickets/${t.id}`}
                className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-0 hover:bg-slate-50"
              >
                <PriorityBadge priority={t.priority} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">
                    {t.number} · {t.title}
                  </div>
                  <div className="truncate text-xs text-slate-500">
                    {t.client.name} · {t.client.address}
                  </div>
                </div>
                <StatusBadge status={t.status} />
                <span
                  className={`text-xs font-medium ${dl.overdue ? "text-red-600" : "text-slate-500"}`}
                >
                  {dl.label}
                </span>
              </Link>
            );
          })}
        </Card>
      </div>
    );
  }

  // Дашборд офиса: сводка по компании
  const active = tickets.filter((t) => ACTIVE_STATUSES.includes(t.status));
  const overdue = active.filter((t) => timeToDeadline(t.deadline).overdue);
  const closed = tickets.filter((t) => t.status === "closed");
  const revenue = closed.reduce((s, t) => s + (t.closing?.revenue ?? 0), 0);
  const companyIncome = closed.reduce(
    (s, t) => s + (t.closing?.companyIncome ?? 0),
    0,
  );
  const activeMasterIds = new Set(
    active.map((t) => t.assigneeId).filter(Boolean),
  );
  const recent = [...tickets]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6);

  return (
    <div>
      <LicenseBanner />
      <PageHeader
        title="Дашборд"
        subtitle="Сводка по сервисной компании за текущий период"
      />
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Всего заявок" value={tickets.length} />
        <StatCard label="В работе" value={active.length} />
        <StatCard
          label="Просроченные"
          value={overdue.length}
          tone={overdue.length > 0 ? "danger" : "default"}
        />
        <StatCard label="Закрытые" value={closed.length} tone="success" />
        <StatCard label="Выручка" value={money(revenue)} hint="по закрытым заявкам" />
        <StatCard
          label="Доход компании"
          value={money(companyIncome)}
          hint="после выплат мастерам"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="border-b border-slate-100 px-4 py-3 text-sm font-semibold">
            Последние заявки
          </div>
          {recent.map((t) => (
            <Link
              key={t.id}
              href={`/tickets/${t.id}`}
              className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-0 hover:bg-slate-50"
            >
              <PriorityBadge priority={t.priority} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">
                  {t.number} · {t.title}
                </div>
                <div className="truncate text-xs text-slate-500">
                  {t.client.name} · {formatDateTime(t.createdAt)}
                </div>
              </div>
              <StatusBadge status={t.status} />
            </Link>
          ))}
        </Card>

        <Card>
          <div className="border-b border-slate-100 px-4 py-3 text-sm font-semibold">
            Активные мастера · {activeMasterIds.size} из {MASTERS.length}
          </div>
          {MASTERS.map((m) => {
            const load = active.filter((t) => t.assigneeId === m.id).length;
            return (
              <div
                key={m.id}
                className="flex items-center gap-3 border-b border-slate-100 px-4 py-2.5 last:border-0"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                  {m.name.split(" ").map((w) => w[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{m.name}</div>
                  <div className="text-xs text-slate-400">
                    {m.type === "staff" ? "Штатный" : "Партнёрский"} · {m.district}
                  </div>
                </div>
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                    load > 2
                      ? "bg-red-50 text-red-600"
                      : load > 0
                        ? "bg-brand-50 text-brand-700"
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {load} акт.
                </span>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}
