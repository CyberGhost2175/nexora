"use client";

import Link from "next/link";
import { useDemo } from "@/lib/store";

/**
 * Мобильный вид мастера: адаптивная вёрстка, имитирующая приложение.
 * На десктопе рендерится в "рамке телефона" для наглядности демо.
 */
export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, setRole, currentUserName } = useDemo();
  const isMasterRole = role === "executor" || role === "master";

  return (
    <div className="min-h-screen bg-slate-200 sm:py-8">
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-canvas shadow-2xl sm:min-h-[calc(100vh-4rem)] sm:overflow-hidden sm:rounded-3xl">
        <header className="bg-brand-900 px-4 pt-4 pb-3 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm font-bold">
                N
              </div>
              <div>
                <div className="text-sm font-semibold leading-tight">
                  Nexora Мастер
                </div>
                <div className="text-[11px] text-slate-400 leading-tight">
                  {isMasterRole ? currentUserName : "Выберите мастера"}
                </div>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-medium hover:bg-white/20"
            >
              ← В CRM
            </Link>
          </div>
          {/* Быстрое переключение персоны мастера — только для демо */}
          <div className="mt-3 flex gap-1.5">
            <button
              onClick={() => setRole("executor")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                role === "executor" ? "bg-white text-brand-900" : "bg-white/10 text-slate-300"
              }`}
            >
              Аскар (штатный)
            </button>
            <button
              onClick={() => setRole("master")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                role === "master" ? "bg-white text-brand-900" : "bg-white/10 text-slate-300"
              }`}
            >
              Виктор (партнёр)
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
