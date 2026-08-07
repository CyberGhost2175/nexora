import type { Act } from "@/lib/types";
import { actTotal } from "@/demo-data/acts";
import { COMPANY } from "@/demo-data/company";
import { formatDate, money } from "@/lib/format";

/**
 * HTML-превью акта выполненных работ.
 * В демо настоящий PDF не генерируется — документ верстается как акт:
 * реквизиты сторон, таблица позиций, итоги, подписи.
 */
export function ActDocument({ act }: { act: Act }) {
  const total = actTotal(act);

  return (
    <div className="mx-auto max-w-3xl bg-white p-8 text-slate-900 shadow-sm ring-1 ring-slate-200 sm:p-12">
      <div className="text-center">
        <h1 className="text-lg font-bold uppercase">
          Акт выполненных работ {act.number}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          от {formatDate(act.date)}
          {act.ticketNumber ? ` · по заявке ${act.ticketNumber}` : ""}
          {act.kind === "maintenance" ? " · плановое ТО" : ""}
        </p>
      </div>

      <div className="mt-8 grid gap-6 text-sm sm:grid-cols-2">
        <div>
          <div className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
            Исполнитель
          </div>
          <div className="mt-1 font-semibold">{COMPANY.name}</div>
          <div className="mt-0.5 text-slate-600">БИН {COMPANY.bin}</div>
          <div className="text-slate-600">{COMPANY.address}</div>
          <div className="text-slate-600">{COMPANY.phone}</div>
        </div>
        <div>
          <div className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
            Заказчик
          </div>
          <div className="mt-1 font-semibold">{act.customer}</div>
          <div className="mt-0.5 text-slate-600">{act.customerDetails}</div>
        </div>
      </div>

      <table className="mt-8 w-full border-collapse text-sm">
        <thead>
          <tr className="border-y border-slate-300 text-left text-xs tracking-wide text-slate-500 uppercase">
            <th className="py-2 pr-2 font-semibold">№</th>
            <th className="py-2 pr-2 font-semibold">Наименование работ / ТМЦ</th>
            <th className="py-2 pr-2 text-right font-semibold">Кол-во</th>
            <th className="py-2 pr-2 font-semibold">Ед.</th>
            <th className="py-2 pr-2 text-right font-semibold">Цена</th>
            <th className="py-2 text-right font-semibold">Сумма</th>
          </tr>
        </thead>
        <tbody>
          {act.rows.map((row, i) => (
            <tr key={i} className="border-b border-slate-100">
              <td className="py-2.5 pr-2 text-slate-400">{i + 1}</td>
              <td className="py-2.5 pr-2">{row.name}</td>
              <td className="py-2.5 pr-2 text-right">{row.qty}</td>
              <td className="py-2.5 pr-2 text-slate-500">{row.unit}</td>
              <td className="py-2.5 pr-2 text-right">{money(row.price)}</td>
              <td className="py-2.5 text-right font-medium">
                {money(row.qty * row.price)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={5} className="py-3 text-right font-semibold">
              Итого:
            </td>
            <td className="py-3 text-right text-base font-bold">
              {money(total)}
            </td>
          </tr>
        </tfoot>
      </table>

      <p className="mt-6 text-sm text-slate-600">
        Вышеперечисленные работы выполнены полностью и в срок. Заказчик
        претензий по объёму, качеству и срокам выполнения работ не имеет.
      </p>

      <div className="mt-10 grid gap-8 text-sm sm:grid-cols-2">
        <div>
          <div className="text-xs text-slate-400">Исполнитель</div>
          <div className="mt-8 border-t border-slate-400 pt-1">
            {COMPANY.director} / {COMPANY.name}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-400">Заказчик</div>
          <div className="mt-8 border-t border-slate-400 pt-1">
            ______________ / {act.customer}
          </div>
        </div>
      </div>
    </div>
  );
}
