"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useDemo } from "@/lib/store";
import { STATUS_LABELS } from "@/lib/status-machine";
import type { Priority, TicketStatus } from "@/lib/types";
import { formatDateTime, timeToDeadline } from "@/lib/format";
import { MASTERS, masterById } from "@/demo-data/masters";
import { PARTNERS, partnerById } from "@/demo-data/partners";
import { Card, EmptyState, PageHeader, PriorityBadge, StatusBadge } from "@/components/ui";

const selectCls =
  "rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-700 outline-none focus:border-accent-500";

export default function TicketsPage() {
  const { visibleTickets, role } = useDemo();
  const [status, setStatus] = useState<TicketStatus | "all">("all");
  const [priority, setPriority] = useState<Priority | "all">("all");
  const [assignee, setAssignee] = useState<string>("all");
  const [partner, setPartner] = useState<string>("all");

  const filtered = useMemo(
    () =>
      visibleTickets.filter(
        (t) =>
          (status === "all" || t.status === status) &&
          (priority === "all" || t.priority === priority) &&
          (assignee === "all" || t.assigneeId === assignee) &&
          (partner === "all" || t.partnerId === partner),
      ),
    [visibleTickets, status, priority, assignee, partner],
  );

  const isOffice = role === "admin" || role === "manager";

  return (
    <div>
      <PageHeader
        title="Заявки"
        subtitle={`${filtered.length} из ${visibleTickets.length} заявок`}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <select value={status} onChange={(e) => setStatus(e.target.value as TicketStatus | "all")} className={selectCls}>
          <option value="all">Все статусы</option>
          {(Object.keys(STATUS_LABELS) as TicketStatus[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value as Priority | "all")} className={selectCls}>
          <option value="all">Все приоритеты</option>
          {(["P1", "P2", "P3", "P4"] as Priority[]).map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        {isOffice && (
          <>
            <select value={assignee} onChange={(e) => setAssignee(e.target.value)} className={selectCls}>
              <option value="all">Все исполнители</option>
              {MASTERS.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <select value={partner} onChange={(e) => setPartner(e.target.value)} className={selectCls}>
              <option value="all">Все партнёры</option>
              {PARTNERS.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState text="Нет заявок под выбранные фильтры" />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs tracking-wide text-slate-400 uppercase">
                <th className="px-4 py-3 font-semibold">Заявка</th>
                <th className="px-4 py-3 font-semibold">Клиент</th>
                <th className="px-4 py-3 font-semibold">Статус</th>
                <th className="px-4 py-3 font-semibold">Приоритет</th>
                <th className="px-4 py-3 font-semibold">Исполнитель</th>
                <th className="px-4 py-3 font-semibold">Дедлайн</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const dl = timeToDeadline(t.deadline);
                const showDeadline = !["closed", "cancelled"].includes(t.status);
                return (
                  <tr key={t.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link href={`/tickets/${t.id}`} className="font-medium text-brand-700 hover:underline">
                        {t.number}
                      </Link>
                      <div className="max-w-56 truncate text-xs text-slate-500">{t.title}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="max-w-44 truncate">{t.client.name}</div>
                      {t.partnerId && (
                        <div className="text-xs text-slate-400">
                          Партнёр: {partnerById(t.partnerId)?.name}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                    <td className="px-4 py-3"><PriorityBadge priority={t.priority} /></td>
                    <td className="px-4 py-3 text-slate-600">
                      {masterById(t.assigneeId)?.name ??
                        (t.proposedToId
                          ? `предложена: ${masterById(t.proposedToId)?.name}`
                          : "—")}
                    </td>
                    <td className="px-4 py-3">
                      {showDeadline ? (
                        <span className={dl.overdue ? "font-medium text-red-600" : "text-slate-500"}>
                          {dl.label}
                        </span>
                      ) : (
                        <span className="text-slate-400">{formatDateTime(t.deadline)}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
