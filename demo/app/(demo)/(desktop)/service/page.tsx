"use client";

import {
  EQUIPMENT_IN_SERVICE,
  SERVICE_STATUS_LABELS,
} from "@/demo-data/equipment";
import { formatDate } from "@/lib/format";
import { Card, PageHeader } from "@/components/ui";

const STATUS_STYLES: Record<string, string> = {
  diagnostics: "bg-blue-50 text-blue-700 ring-blue-600/20",
  repair: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  awaiting_parts: "bg-amber-50 text-amber-700 ring-amber-600/20",
  ready: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};

export default function ServicePage() {
  return (
    <div>
      <PageHeader
        title="Оборудование в сервисе"
        subtitle="Техника, принятая в сервисный центр"
      />
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs tracking-wide text-slate-400 uppercase">
              <th className="px-4 py-3 font-semibold">Оборудование</th>
              <th className="px-4 py-3 font-semibold">Серийный номер</th>
              <th className="px-4 py-3 font-semibold">Клиент</th>
              <th className="px-4 py-3 font-semibold">Принято</th>
              <th className="px-4 py-3 font-semibold">Заявка</th>
              <th className="px-4 py-3 font-semibold">Статус</th>
            </tr>
          </thead>
          <tbody>
            {EQUIPMENT_IN_SERVICE.map((e) => (
              <tr key={e.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{e.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{e.serial}</td>
                <td className="px-4 py-3 text-slate-600">{e.client}</td>
                <td className="px-4 py-3 text-slate-500">{formatDate(e.acceptedAt)}</td>
                <td className="px-4 py-3 text-brand-700">{e.ticketNumber}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[e.status]}`}
                  >
                    {SERVICE_STATUS_LABELS[e.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
