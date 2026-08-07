"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useDemo } from "@/lib/store";
import { availableTransitions, STATUS_LABELS } from "@/lib/status-machine";
import { calcFinance, PAYOUT_RATES } from "@/lib/finance";
import { money, timeToDeadline } from "@/lib/format";
import { masterById } from "@/demo-data/masters";
import { PriorityBadge, StatusBadge } from "@/components/ui";

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-accent-500";

export default function MobileTicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { tickets, changeTicketStatus, closeTicket } = useDemo();
  const [workDone, setWorkDone] = useState("");
  const [revenue, setRevenue] = useState("");
  const [showClosing, setShowClosing] = useState(false);

  const ticket = tickets.find((t) => t.id === id);
  if (!ticket) {
    return (
      <div className="p-4 text-sm text-slate-500">
        Заявка не найдена.{" "}
        <Link href="/mobile" className="text-brand-700 underline">
          Назад
        </Link>
      </div>
    );
  }

  const dl = timeToDeadline(ticket.deadline);
  const masterType = masterById(ticket.assigneeId)?.type ?? "staff";
  const partsCost = ticket.usedParts.reduce((s, p) => s + p.qty * p.price, 0);
  const preview = calcFinance(Number(revenue) || 0, partsCost, masterType);
  const isFinal = ["closed", "cancelled"].includes(ticket.status);
  const transitions = availableTransitions(ticket.status).filter(
    (s) => s !== "closed" && s !== "cancelled",
  );

  // Ссылка-заглушка "открыть в 2GIS": в реальном приложении здесь
  // deep-link 2GIS с координатами точки.
  const gisHref = `https://2gis.kz/almaty/search/${encodeURIComponent(ticket.client.address)}`;

  return (
    <div className="space-y-4 p-4">
      <Link href="/mobile" className="text-xs text-slate-400">
        ← Мои заявки
      </Link>

      <div>
        <div className="flex items-center gap-2">
          <PriorityBadge priority={ticket.priority} />
          <span className="text-base font-bold">{ticket.number}</span>
          <span className="ml-auto">
            <StatusBadge status={ticket.status} />
          </span>
        </div>
        <h1 className="mt-1.5 text-lg leading-snug font-semibold">
          {ticket.title}
        </h1>
        {!isFinal && (
          <div
            className={`mt-1 text-sm font-medium ${dl.overdue ? "text-red-600" : "text-slate-500"}`}
          >
            {dl.overdue ? "⚠ SLA нарушен: " : "⏱ До дедлайна: "}
            {dl.label}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
        <div className="text-sm font-semibold">{ticket.client.name}</div>
        <div className="mt-0.5 text-sm text-slate-500">{ticket.client.address}</div>
        <div className="mt-2 flex gap-2">
          <a
            href={`tel:${ticket.client.phone.replace(/[^+\d]/g, "")}`}
            className="flex-1 rounded-lg border border-slate-300 bg-white py-2 text-center text-sm font-medium text-slate-700"
          >
            📞 Позвонить
          </a>
          <a
            href={gisHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-lg bg-emerald-600 py-2 text-center text-sm font-semibold text-white"
          >
            Открыть в 2GIS
          </a>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
        <div className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
          Оборудование
        </div>
        <div className="mt-1 text-sm font-medium">{ticket.equipment}</div>
        <p className="mt-2 text-sm text-slate-600">{ticket.description}</p>
        {ticket.usedParts.length > 0 && (
          <div className="mt-3 border-t border-slate-100 pt-2">
            <div className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
              Запчасти
            </div>
            {ticket.usedParts.map((p, i) => (
              <div key={i} className="mt-1 flex justify-between text-sm">
                <span className="text-slate-600">
                  {p.name} × {p.qty}
                </span>
                <span className="font-medium">{money(p.qty * p.price)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {!isFinal && transitions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {transitions.map((to) => (
            <button
              key={to}
              onClick={() => changeTicketStatus(ticket.id, to)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700"
            >
              → {STATUS_LABELS[to]}
            </button>
          ))}
        </div>
      )}

      {ticket.closing ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5">
          <div className="text-sm font-semibold text-emerald-800">
            Заявка закрыта
          </div>
          <div className="mt-2 space-y-1 text-sm">
            <Row label="Сумма по заявке" value={money(ticket.closing.revenue)} />
            <Row label="Запчасти" value={money(ticket.closing.partsCost)} />
            <Row label="Прибыль" value={money(ticket.closing.profit)} />
            <Row label="Моя выплата" value={money(ticket.closing.payout)} bold />
          </div>
        </div>
      ) : !isFinal && !showClosing ? (
        <button
          onClick={() => setShowClosing(true)}
          className="w-full rounded-xl bg-brand-800 py-3 text-sm font-semibold text-white"
        >
          Заполнить анкету закрытия
        </button>
      ) : !isFinal ? (
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <div className="text-sm font-semibold">Анкета закрытия</div>
          <label className="mt-3 mb-1 block text-xs font-medium text-slate-500">
            Что сделано
          </label>
          <textarea
            value={workDone}
            onChange={(e) => setWorkDone(e.target.value)}
            rows={2}
            className={inputCls}
            placeholder="Описание выполненных работ…"
          />
          <label className="mt-3 mb-1 block text-xs font-medium text-slate-500">
            Сумма по заявке, ₸
          </label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
            className={inputCls}
            placeholder="0"
          />
          {/* Прибыль/комиссия/выплата пересчитываются на лету */}
          <div className="mt-3 space-y-1 rounded-lg bg-slate-50 p-3 text-sm">
            <Row label="Себестоимость запчастей" value={money(partsCost)} />
            <Row label="Прибыль" value={money(preview.profit)} />
            <Row
              label={`Комиссия компании (${Math.round((1 - PAYOUT_RATES[masterType]) * 100)}%)`}
              value={money(preview.profit - preview.payout)}
            />
            <Row
              label={`Моя выплата (${Math.round(PAYOUT_RATES[masterType] * 100)}%)`}
              value={money(preview.payout)}
              bold
            />
          </div>
          <button
            disabled={!workDone.trim() || !revenue}
            onClick={() => closeTicket(ticket.id, workDone.trim(), Number(revenue))}
            className="mt-3 w-full rounded-xl bg-brand-800 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            Закрыть заявку
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-500">{label}</span>
      <span className={bold ? "font-bold" : "font-medium"}>{value}</span>
    </div>
  );
}
