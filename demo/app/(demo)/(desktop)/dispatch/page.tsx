"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDemo } from "@/lib/store";
import { timeToDeadline } from "@/lib/format";
import { MASTERS, masterById } from "@/demo-data/masters";
import { Button, Card, EmptyState, PageHeader, PriorityBadge } from "@/components/ui";

export default function DispatchPage() {
  const { tickets, assignMaster, proposeMaster } = useDemo();
  const [selection, setSelection] = useState<Record<string, string>>({});
  // тик раз в 30 секунд, чтобы таймеры до дедлайна обновлялись на экране
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((v) => v + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const queue = tickets
    .filter((t) => t.status === "new")
    .sort((a, b) => a.priority.localeCompare(b.priority));

  return (
    <div>
      <PageHeader
        title="Диспетчеризация"
        subtitle="Новые заявки: приоритет, таймер SLA, назначение исполнителей"
      />

      {queue.length === 0 ? (
        <EmptyState text="Очередь пуста — все новые заявки разобраны" />
      ) : (
        <div className="space-y-3">
          {queue.map((t) => {
            const dl = timeToDeadline(t.deadline);
            const selected = selection[t.id] ?? "";
            const proposed = masterById(t.proposedToId);
            return (
              <Card key={t.id} className="p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <PriorityBadge priority={t.priority} />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/tickets/${t.id}`}
                      className="text-sm font-semibold text-brand-700 hover:underline"
                    >
                      {t.number} · {t.title}
                    </Link>
                    <div className="text-xs text-slate-500">
                      {t.client.name} · {t.client.address}
                    </div>
                  </div>
                  <div
                    className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                      dl.overdue
                        ? "bg-red-50 text-red-600"
                        : t.priority === "P1"
                          ? "bg-orange-50 text-orange-600"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {dl.overdue ? "SLA нарушен: " : "До дедлайна: "}
                    {dl.label}
                  </div>
                </div>

                {proposed && (
                  <p className="mt-2 text-xs text-amber-600">
                    Предложена мастеру: {proposed.name} — ждём подтверждения
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                  <select
                    value={selected}
                    onChange={(e) =>
                      setSelection((prev) => ({ ...prev, [t.id]: e.target.value }))
                    }
                    className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-accent-500"
                  >
                    <option value="">Выбрать мастера…</option>
                    {MASTERS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} · загрузка {m.activeLoad} ·{" "}
                        {m.type === "staff" ? "штат" : "партнёр"}
                      </option>
                    ))}
                  </select>
                  <Button
                    variant="secondary"
                    disabled={!selected}
                    onClick={() => proposeMaster(t.id, selected)}
                  >
                    Предложить мастеру
                  </Button>
                  <Button
                    disabled={!selected}
                    onClick={() => assignMaster(t.id, selected)}
                  >
                    Назначить исполнителя
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
