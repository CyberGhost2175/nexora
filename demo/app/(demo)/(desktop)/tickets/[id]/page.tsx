"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useDemo } from "@/lib/store";
import {
  availableTransitions,
  STATUS_LABELS,
} from "@/lib/status-machine";
import { calcFinance, PAYOUT_RATES } from "@/lib/finance";
import { formatDateTime, money, timeToDeadline } from "@/lib/format";
import { MASTERS, masterById } from "@/demo-data/masters";
import { partnerById } from "@/demo-data/partners";
import {
  Button,
  Card,
  PriorityBadge,
  StatusBadge,
} from "@/components/ui";

const selectCls =
  "w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-accent-500";
const inputCls =
  "w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm outline-none focus:border-accent-500";

export default function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    role,
    tickets,
    parts,
    changeTicketStatus,
    assignMaster,
    proposeMaster,
    addComment,
    consumePart,
    closeTicket,
  } = useDemo();

  const [comment, setComment] = useState("");
  const [partId, setPartId] = useState("");
  const [partQty, setPartQty] = useState(1);
  const [workDone, setWorkDone] = useState("");
  const [revenue, setRevenue] = useState("");

  const ticket = tickets.find((t) => t.id === id);
  const isOffice = role === "admin" || role === "manager";

  if (!ticket) {
    return (
      <div className="text-sm text-slate-500">
        Заявка не найдена.{" "}
        <Link href="/tickets" className="text-brand-700 underline">
          К списку заявок
        </Link>
      </div>
    );
  }

  const dl = timeToDeadline(ticket.deadline);
  const transitions = availableTransitions(ticket.status);
  const assignee = masterById(ticket.assigneeId);
  const partner = partnerById(ticket.partnerId);
  const partsCost = ticket.usedParts.reduce((s, p) => s + p.qty * p.price, 0);
  const canClose = !["closed", "cancelled"].includes(ticket.status);
  const preview = calcFinance(
    Number(revenue) || 0,
    partsCost,
    assignee?.type ?? "staff",
  );
  const stockParts = parts.filter((p) => p.section === "SERVICE");

  return (
    <div>
      <div className="mb-6">
        <Link href="/tickets" className="text-xs text-slate-400 hover:text-slate-600">
          ← Заявки
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-semibold tracking-tight">
            {ticket.number} · {ticket.title}
          </h1>
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
          {canClose && (
            <span className={`text-sm ${dl.overdue ? "font-semibold text-red-600" : "text-slate-500"}`}>
              {dl.overdue ? "⚠ " : "⏱ "}
              {dl.label}
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Card className="p-4">
            <h2 className="mb-2 text-sm font-semibold">Описание</h2>
            <p className="text-sm text-slate-600">{ticket.description}</p>
            <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase">Клиент</div>
                <div className="mt-1 font-medium">{ticket.client.name}</div>
                <div className="text-slate-500">{ticket.client.phone}</div>
                <div className="text-slate-500">{ticket.client.address}</div>
                {partner && (
                  <div className="mt-1 text-xs text-slate-400">
                    Сетевой партнёр: {partner.name} ({partner.contractNumber})
                  </div>
                )}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase">Оборудование</div>
                <div className="mt-1 font-medium">{ticket.equipment}</div>
                <div className="mt-3 text-xs font-semibold text-slate-400 uppercase">Вложения</div>
                {ticket.attachments.length === 0 ? (
                  <div className="mt-1 text-xs text-slate-400">Нет вложений</div>
                ) : (
                  ticket.attachments.map((a) => (
                    <div key={a.name} className="mt-1 flex items-center gap-1.5 text-slate-600">
                      <span>📎</span>
                      <span className="underline decoration-dotted">{a.name}</span>
                      <span className="text-xs text-slate-400">{a.size}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="mb-3 text-sm font-semibold">Запчасти по заявке</h2>
            {ticket.usedParts.length === 0 ? (
              <p className="text-sm text-slate-400">Запчасти не списывались</p>
            ) : (
              <table className="w-full text-sm">
                <tbody>
                  {ticket.usedParts.map((p, i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0">
                      <td className="py-2">{p.name}</td>
                      <td className="py-2 text-right text-slate-500">× {p.qty}</td>
                      <td className="py-2 text-right font-medium">{money(p.qty * p.price)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="pt-2 font-semibold">Итого себестоимость</td>
                    <td />
                    <td className="pt-2 text-right font-semibold">{money(partsCost)}</td>
                  </tr>
                </tbody>
              </table>
            )}
            {canClose && role !== "master" && (
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                <select value={partId} onChange={(e) => setPartId(e.target.value)} className={`${selectCls} max-w-72`}>
                  <option value="">Выбрать запчасть со склада…</option>
                  {stockParts.map((p) => (
                    <option key={p.id} value={p.id} disabled={(p.stock ?? 0) < 1}>
                      {p.name} (остаток: {p.stock})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  value={partQty}
                  onChange={(e) => setPartQty(Number(e.target.value))}
                  className={`${inputCls} w-16`}
                />
                <Button
                  variant="secondary"
                  disabled={!partId}
                  onClick={() => {
                    consumePart(ticket.id, partId, partQty);
                    setPartId("");
                    setPartQty(1);
                  }}
                >
                  Списать в заявку
                </Button>
              </div>
            )}
          </Card>

          <Card className="p-4">
            <h2 className="mb-3 text-sm font-semibold">Лента событий</h2>
            <div className="space-y-3">
              {[...ticket.events].reverse().map((e) => (
                <div key={e.id} className="flex gap-3 text-sm">
                  <div
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      e.kind === "comment"
                        ? "bg-accent-500"
                        : e.kind === "status"
                          ? "bg-purple-400"
                          : "bg-slate-300"
                    }`}
                  />
                  <div className="min-w-0">
                    <span className={e.kind === "system" || e.kind === "status" ? "text-slate-500" : ""}>
                      {e.text}
                    </span>
                    <div className="text-xs text-slate-400">
                      {e.author} · {formatDateTime(e.at)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Добавить комментарий…"
                className={inputCls}
              />
              <Button
                disabled={!comment.trim()}
                onClick={() => {
                  addComment(ticket.id, comment.trim());
                  setComment("");
                }}
              >
                Отправить
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <h2 className="mb-3 text-sm font-semibold">Статус заявки</h2>
            {/* Доступные переходы приходят из конфига конечного автомата */}
            {transitions.length === 0 ? (
              <p className="text-sm text-slate-400">Финальный статус — переходы недоступны</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {transitions.map((to) => (
                  <Button
                    key={to}
                    variant={to === "cancelled" ? "danger" : "secondary"}
                    onClick={() => changeTicketStatus(ticket.id, to)}
                  >
                    → {STATUS_LABELS[to]}
                  </Button>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-4">
            <h2 className="mb-3 text-sm font-semibold">Исполнитель</h2>
            {assignee ? (
              <div className="text-sm">
                <div className="font-medium">{assignee.name}</div>
                <div className="text-slate-500">
                  {assignee.type === "staff" ? "Штатный мастер" : "Партнёрский мастер"} · {assignee.phone}
                </div>
              </div>
            ) : ticket.proposedToId ? (
              <p className="text-sm text-amber-600">
                Предложена мастеру: {masterById(ticket.proposedToId)?.name}
              </p>
            ) : (
              <p className="text-sm text-slate-400">Не назначен</p>
            )}
            {isOffice && canClose && (
              <select
                className={`${selectCls} mt-3`}
                value=""
                onChange={(e) => e.target.value && assignMaster(ticket.id, e.target.value)}
              >
                <option value="">Назначить исполнителя…</option>
                {MASTERS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.type === "staff" ? "штат" : "партнёр"})
                  </option>
                ))}
              </select>
            )}
            {isOffice && canClose && !ticket.assigneeId && (
              <select
                className={`${selectCls} mt-2`}
                value=""
                onChange={(e) => e.target.value && proposeMaster(ticket.id, e.target.value)}
              >
                <option value="">Предложить мастеру…</option>
                {MASTERS.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            )}
          </Card>

          {ticket.closing ? (
            <Card className="p-4">
              <h2 className="mb-3 text-sm font-semibold">Финансы по заявке</h2>
              <dl className="space-y-1.5 text-sm">
                <Row label="Выполненные работы" value={ticket.closing.workDone} wide />
                <Row label="Сумма по заявке" value={money(ticket.closing.revenue)} />
                <Row label="Себестоимость запчастей" value={money(ticket.closing.partsCost)} />
                <Row label="Прибыль" value={money(ticket.closing.profit)} />
                <Row label="Выплата мастеру" value={money(ticket.closing.payout)} />
                <Row label="Доход компании" value={money(ticket.closing.companyIncome)} bold />
              </dl>
            </Card>
          ) : (
            canClose &&
            ticket.assigneeId && (
              <Card className="p-4">
                <h2 className="mb-3 text-sm font-semibold">Анкета закрытия</h2>
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  Выполненные работы
                </label>
                <textarea
                  value={workDone}
                  onChange={(e) => setWorkDone(e.target.value)}
                  rows={2}
                  className={inputCls}
                />
                <label className="mt-3 mb-1 block text-xs font-medium text-slate-500">
                  Сумма по заявке, ₸
                </label>
                <input
                  type="number"
                  min={0}
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  className={inputCls}
                />
                <dl className="mt-3 space-y-1.5 rounded-lg bg-slate-50 p-3 text-sm">
                  <Row label="Себестоимость запчастей" value={money(partsCost)} />
                  <Row label="Прибыль" value={money(preview.profit)} />
                  <Row
                    label={`Выплата мастеру (${Math.round(PAYOUT_RATES[assignee?.type ?? "staff"] * 100)}%)`}
                    value={money(preview.payout)}
                  />
                  <Row label="Доход компании" value={money(preview.companyIncome)} bold />
                </dl>
                <Button
                  className="mt-3 w-full"
                  disabled={!workDone.trim() || !revenue}
                  onClick={() => closeTicket(ticket.id, workDone.trim(), Number(revenue))}
                >
                  Закрыть заявку
                </Button>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  wide,
}: {
  label: string;
  value: string;
  bold?: boolean;
  wide?: boolean;
}) {
  if (wide) {
    return (
      <div>
        <dt className="text-xs text-slate-400">{label}</dt>
        <dd className="text-slate-700">{value}</dd>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className={bold ? "font-semibold" : "font-medium"}>{value}</dd>
    </div>
  );
}
