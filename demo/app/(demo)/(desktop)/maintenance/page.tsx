"use client";

import { useState } from "react";
import { useDemo } from "@/lib/store";
import { formatDate, money } from "@/lib/format";
import { ACTS } from "@/demo-data/acts";
import { ActDocument } from "@/components/ActDocument";
import { Button, Card, PageHeader } from "@/components/ui";

export default function MaintenancePage() {
  const { partners, closePoint, transferPointToRepair } = useDemo();
  const [openPartner, setOpenPartner] = useState<string | null>(partners[0]?.id ?? null);
  const [actPreview, setActPreview] = useState(false);

  return (
    <div>
      <PageHeader
        title="Плановое ТО"
        subtitle="Сетевые партнёры: прогресс закрытия точек за период"
      />

      <div className="space-y-4">
        {partners.map((p) => {
          const done = p.points.filter((pt) => pt.maintenanceDone).length;
          const pct = Math.round((done / p.points.length) * 100);
          const open = openPartner === p.id;
          return (
            <Card key={p.id}>
              <button
                onClick={() => setOpenPartner(open ? null : p.id)}
                className="flex w-full flex-wrap items-center gap-4 px-4 py-4 text-left"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="text-xs text-slate-500">
                    {p.kind} · договор {p.contractNumber} · период {p.maintenancePeriod} ·{" "}
                    {money(p.pricePerPoint)}/точка
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-40 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${pct >= 90 ? "bg-emerald-500" : pct >= 40 ? "bg-accent-500" : "bg-amber-400"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold whitespace-nowrap">
                    {done} / {p.points.length}
                  </span>
                  <span className="text-slate-400">{open ? "▾" : "▸"}</span>
                </div>
              </button>

              {open && (
                <div className="border-t border-slate-100">
                  {p.points.map((pt) => (
                    <div
                      key={pt.id}
                      className="flex flex-wrap items-center gap-3 border-b border-slate-50 px-4 py-2.5 last:border-0"
                    >
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${
                          pt.maintenanceDone
                            ? "bg-emerald-500"
                            : pt.transferredToRepair
                              ? "bg-red-400"
                              : "bg-slate-300"
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium">{pt.name}</div>
                        <div className="text-xs text-slate-400">{pt.address}</div>
                      </div>
                      {pt.maintenanceDone ? (
                        <span className="text-xs text-emerald-600">
                          Закрыта {pt.doneAt ? formatDate(pt.doneAt) : ""}
                        </span>
                      ) : pt.transferredToRepair ? (
                        <span className="text-xs font-medium text-red-500">
                          Переведена на ремонт
                        </span>
                      ) : (
                        <div className="flex gap-2">
                          <Button variant="secondary" onClick={() => closePoint(p.id, pt.id)}>
                            Закрыть точку
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => transferPointToRepair(p.id, pt.id)}
                          >
                            Перевести на ремонт
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  {p.id === "p1" && (
                    <div className="px-4 py-3">
                      <Button variant="secondary" onClick={() => setActPreview(true)}>
                        Просмотреть акт ТО за период
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {actPreview && (
        <div
          className="fixed inset-0 z-40 overflow-auto bg-slate-900/60 p-4 sm:p-8"
          onClick={() => setActPreview(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className="mx-auto max-w-3xl">
            <div className="mb-2 flex justify-end">
              <Button variant="secondary" onClick={() => setActPreview(false)}>
                Закрыть предпросмотр
              </Button>
            </div>
            {/* HTML-превью акта: в демо настоящий PDF не генерируется */}
            <ActDocument act={ACTS.find((a) => a.id === "a3")!} />
          </div>
        </div>
      )}
    </div>
  );
}
