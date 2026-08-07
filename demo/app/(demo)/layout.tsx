"use client";

import { useEffect, useState } from "react";
import { DemoProvider } from "@/lib/store";
import { Toasts } from "@/components/Toasts";

/**
 * Общий провайдер демо-состояния: заявки, склад, ТО, роль, уведомления,
 * лицензия. Состояние живёт в React state и не персистится между
 * перезагрузками — это осознанное ограничение демо-стенда.
 *
 * Контент рендерится только после монтирования на клиенте: даты фикстур
 * и таймеры SLA считаются от Date.now(), поэтому серверный HTML заведомо
 * расходился бы с клиентским (hydration mismatch). Демо закрыто от
 * индексации, так что SSR-контент здесь не нужен.
 */
export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="flex h-9 w-9 animate-pulse items-center justify-center rounded-lg bg-brand-800 text-base font-bold text-white">
            N
          </div>
          <span className="text-sm">Загрузка демо…</span>
        </div>
      </div>
    );
  }

  return (
    <DemoProvider>
      {children}
      <Toasts />
    </DemoProvider>
  );
}
