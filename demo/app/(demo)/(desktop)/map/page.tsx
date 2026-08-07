"use client";

import { useDemo } from "@/lib/store";
import { ACTIVE_STATUSES } from "@/lib/status-machine";
import { masterById } from "@/demo-data/masters";
import { Card, PageHeader, PriorityBadge } from "@/components/ui";

/**
 * ВНИМАНИЕ: это статичная заглушка карты для демо-стенда.
 * В реальном продукте здесь интеграция Yandex Maps + 2GIS:
 * геокодирование адресов, live-позиции мастеров и построение
 * оптимального маршрута дня.
 */
export default function MapPage() {
  const { visibleTickets, role, currentUserName } = useDemo();
  const isOffice = role === "admin" || role === "manager";

  const route = visibleTickets
    .filter((t) => ACTIVE_STATUSES.includes(t.status) && t.assigneeId)
    .slice(0, 8);

  return (
    <div>
      <PageHeader
        title="Карта и маршруты"
        subtitle={
          isOffice
            ? "Точки активных заявок и маршруты мастеров"
            : `Маршрут дня — ${currentUserName}`
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Заглушка карты */}
        <Card className="relative flex min-h-96 items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          {route.slice(0, 6).map((t, i) => (
            <div
              key={t.id}
              className="absolute flex h-7 w-7 items-center justify-center rounded-full bg-brand-800 text-xs font-bold text-white shadow-lg"
              style={{
                left: `${18 + ((i * 23) % 60)}%`,
                top: `${20 + ((i * 31) % 55)}%`,
              }}
            >
              {i + 1}
            </div>
          ))}
          <div className="relative rounded-lg bg-white/90 px-4 py-2 text-center text-sm text-slate-500 shadow-sm">
            Схема города · демо-заглушка
            <div className="text-xs text-slate-400">
              В боевой версии — Yandex Maps + 2GIS
            </div>
          </div>
        </Card>

        <Card>
          <div className="border-b border-slate-100 px-4 py-3 text-sm font-semibold">
            Маршрут дня · {route.length} точек
          </div>
          {route.map((t, i) => (
            <div
              key={t.id}
              className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-0"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">
                  {t.number} · {t.client.name}
                </div>
                <div className="truncate text-xs text-slate-500">
                  {t.client.address}
                  {isOffice && t.assigneeId
                    ? ` · ${masterById(t.assigneeId)?.name}`
                    : ""}
                </div>
              </div>
              <PriorityBadge priority={t.priority} />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
