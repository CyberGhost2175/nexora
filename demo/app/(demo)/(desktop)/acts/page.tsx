"use client";

import { useState } from "react";
import { useDemo } from "@/lib/store";
import { actTotal } from "@/demo-data/acts";
import { formatDate, money } from "@/lib/format";
import { ActDocument } from "@/components/ActDocument";
import { Button, Card, PageHeader } from "@/components/ui";

export default function ActsPage() {
  const { acts, shareLinks, createShareLink, toast } = useDemo();
  const [previewId, setPreviewId] = useState<string | null>(null);

  async function share(actId: string) {
    const token = createShareLink(actId);
    const url = `${window.location.origin}/act/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      toast("Публичная ссылка скопирована");
    } catch {
      toast("Ссылка создана");
    }
  }

  return (
    <div>
      <PageHeader
        title="Акты выполненных работ"
        subtitle="АВР по заявкам и плановому ТО, публичные ссылки для клиентов"
      />

      <div className="space-y-3">
        {acts.map((act) => {
          const token = shareLinks[act.id];
          return (
            <Card key={act.id} className="p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">
                    {act.number}
                    <span className="ml-2 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                      {act.kind === "maintenance" ? "Плановое ТО" : "Ремонт"}
                    </span>
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {act.customer} · {formatDate(act.date)}
                    {act.ticketNumber ? ` · заявка ${act.ticketNumber}` : ""}
                  </div>
                </div>
                <div className="text-sm font-bold">{money(actTotal(act))}</div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setPreviewId(act.id)}>
                    Просмотр
                  </Button>
                  <Button onClick={() => share(act.id)}>
                    {token ? "Скопировать ссылку" : "Создать публичную ссылку"}
                  </Button>
                </div>
              </div>
              {token && (
                <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs break-all text-slate-500">
                  {typeof window !== "undefined" ? window.location.origin : ""}/act/{token}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {previewId && (
        <div
          className="fixed inset-0 z-40 overflow-auto bg-slate-900/60 p-4 sm:p-8"
          onClick={() => setPreviewId(null)}
        >
          <div onClick={(e) => e.stopPropagation()} className="mx-auto max-w-3xl">
            <div className="mb-2 flex justify-end">
              <Button variant="secondary" onClick={() => setPreviewId(null)}>
                Закрыть предпросмотр
              </Button>
            </div>
            <ActDocument act={acts.find((a) => a.id === previewId)!} />
          </div>
        </div>
      )}
    </div>
  );
}
