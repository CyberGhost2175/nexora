"use client";

import { useState } from "react";
import { useDemo } from "@/lib/store";
import { money } from "@/lib/format";
import { partnerById } from "@/demo-data/partners";
import { ACTIVE_STATUSES } from "@/lib/status-machine";
import { Button, Card, PageHeader } from "@/components/ui";

export default function WarehousePage() {
  const { parts, tickets, consumePart } = useDemo();
  const [section, setSection] = useState<"SERVICE" | "PARTNER">("SERVICE");
  const [writeOff, setWriteOff] = useState<{ partId: string; ticketId: string } | null>(null);

  const list = parts.filter((p) => p.section === section);
  const activeTickets = tickets.filter((t) => ACTIVE_STATUSES.includes(t.status));
  const lowCount = parts.filter(
    (p) => p.stock !== null && p.minStock !== null && p.stock <= p.minStock,
  ).length;

  return (
    <div>
      <PageHeader
        title="Склад запчастей"
        subtitle={`${parts.length} позиций в каталоге · ${lowCount} с низким остатком`}
      />

      <div className="mb-4 flex gap-1 rounded-lg bg-slate-100 p-1 text-sm font-medium w-fit">
        {(
          [
            ["SERVICE", "SERVICE — собственный склад"],
            ["PARTNER", "QazFood — учёт без остатков"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSection(key)}
            className={`rounded-md px-3 py-1.5 transition ${
              section === key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs tracking-wide text-slate-400 uppercase">
              <th className="px-4 py-3 font-semibold">Артикул</th>
              <th className="px-4 py-3 font-semibold">Наименование</th>
              <th className="px-4 py-3 font-semibold">Категория</th>
              <th className="px-4 py-3 text-right font-semibold">Цена</th>
              <th className="px-4 py-3 text-right font-semibold">Остаток</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {list.map((p) => {
              const low = p.stock !== null && p.minStock !== null && p.stock <= p.minStock;
              return (
                <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.sku}</td>
                  <td className="px-4 py-3 font-medium">
                    {p.name}
                    {p.partnerId && (
                      <span className="ml-2 text-xs text-slate-400">
                        {partnerById(p.partnerId)?.name}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{p.category}</td>
                  <td className="px-4 py-3 text-right">{money(p.price)}</td>
                  <td className="px-4 py-3 text-right">
                    {p.stock === null ? (
                      <span className="text-xs text-slate-400">без остатков</span>
                    ) : (
                      <span
                        className={`inline-flex min-w-8 justify-center rounded-md px-2 py-0.5 text-xs font-semibold ${
                          p.stock === 0
                            ? "bg-red-100 text-red-700"
                            : low
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {p.stock}
                        {low && p.stock > 0 && " ⚠"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {p.stock !== null && p.stock > 0 && (
                      <Button
                        variant="secondary"
                        onClick={() => setWriteOff({ partId: p.id, ticketId: "" })}
                      >
                        Списать в заявку
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {writeOff && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 p-4"
          onClick={() => setWriteOff(null)}
        >
          <Card className="w-full max-w-md p-5" >
            <div onClick={(e) => e.stopPropagation()}>
              <h2 className="text-sm font-semibold">Списание в заявку</h2>
              <p className="mt-1 text-xs text-slate-500">
                {parts.find((p) => p.id === writeOff.partId)?.name}
              </p>
              <select
                value={writeOff.ticketId}
                onChange={(e) => setWriteOff({ ...writeOff, ticketId: e.target.value })}
                className="mt-3 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm outline-none focus:border-accent-500"
              >
                <option value="">Выбрать заявку…</option>
                {activeTickets.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.number} · {t.title}
                  </option>
                ))}
              </select>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setWriteOff(null)}>
                  Отмена
                </Button>
                <Button
                  disabled={!writeOff.ticketId}
                  onClick={() => {
                    consumePart(writeOff.ticketId, writeOff.partId, 1);
                    setWriteOff(null);
                  }}
                >
                  Списать 1 шт.
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
