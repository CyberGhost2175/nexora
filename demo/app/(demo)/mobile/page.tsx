"use client";

import Link from "next/link";
import { useDemo } from "@/lib/store";
import { ACTIVE_STATUSES } from "@/lib/status-machine";
import { timeToDeadline } from "@/lib/format";
import { PriorityBadge, StatusBadge } from "@/components/ui";

export default function MobileHomePage() {
  const { tickets, currentMasterId, acceptProposal, declineProposal } =
    useDemo();

  const mine = tickets.filter(
    (t) =>
      t.assigneeId === currentMasterId && ACTIVE_STATUSES.includes(t.status),
  );
  const proposed = tickets.filter((t) => t.proposedToId === currentMasterId);

  return (
    <div className="space-y-5 p-4">
      {proposed.length > 0 && (
        <section>
          <h2 className="mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
            Предложенные заявки · {proposed.length}
          </h2>
          <div className="space-y-2">
            {proposed.map((t) => (
              <div
                key={t.id}
                className="rounded-xl border border-amber-200 bg-amber-50/60 p-3"
              >
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={t.priority} />
                  <span className="text-sm font-semibold">{t.number}</span>
                </div>
                <div className="mt-1 text-sm font-medium">{t.title}</div>
                <div className="text-xs text-slate-500">
                  {t.client.name} · {t.client.address}
                </div>
                <div className="mt-2.5 flex gap-2">
                  <button
                    onClick={() => acceptProposal(t.id)}
                    className="flex-1 rounded-lg bg-brand-800 py-2 text-sm font-semibold text-white"
                  >
                    Принять
                  </button>
                  <button
                    onClick={() => declineProposal(t.id)}
                    className="flex-1 rounded-lg border border-slate-300 bg-white py-2 text-sm font-medium text-slate-600"
                  >
                    Отклонить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
          Мои заявки · {mine.length}
        </h2>
        {mine.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 py-8 text-center text-sm text-slate-400">
            Нет активных заявок
          </p>
        ) : (
          <div className="space-y-2">
            {mine.map((t) => {
              const dl = timeToDeadline(t.deadline);
              return (
                <Link
                  key={t.id}
                  href={`/mobile/${t.id}`}
                  className="block rounded-xl border border-slate-200 bg-white p-3 shadow-sm active:bg-slate-50"
                >
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={t.priority} />
                    <span className="text-sm font-semibold">{t.number}</span>
                    <span className="ml-auto">
                      <StatusBadge status={t.status} />
                    </span>
                  </div>
                  <div className="mt-1.5 text-sm font-medium">{t.title}</div>
                  <div className="text-xs text-slate-500">
                    {t.client.name} · {t.client.address}
                  </div>
                  <div
                    className={`mt-1.5 text-xs font-medium ${dl.overdue ? "text-red-600" : "text-slate-400"}`}
                  >
                    {dl.overdue ? "⚠ " : "⏱ "}
                    {dl.label}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
