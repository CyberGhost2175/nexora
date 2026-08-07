"use client";

import { useState } from "react";
import Link from "next/link";
import { useDemo } from "@/lib/store";
import { ROLE_LABELS } from "@/lib/roles";
import type { Role } from "@/lib/types";
import { formatDateTime } from "@/lib/format";
import { Icon } from "./icons";

export function Header() {
  const { role, setRole, currentUserName, notifications, unreadCount, markAllRead } =
    useDemo();
  const [bellOpen, setBellOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-2 lg:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-800 text-sm font-bold text-white">
          N
        </div>
        <span className="text-sm font-semibold">Nexora</span>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {/* Переключатель роли — только для демо-режима */}
        <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5">
          <span className="hidden text-xs font-medium text-slate-400 sm:inline">
            Роль
          </span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="bg-transparent text-sm font-medium text-slate-700 outline-none"
          >
            {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </label>

        {/* Уведомления */}
        <div className="relative">
          <button
            onClick={() => setBellOpen((v) => !v)}
            className="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
            aria-label="Уведомления"
          >
            <Icon name="bell" className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
          {bellOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
                <span className="text-sm font-semibold">Уведомления</span>
                <button
                  onClick={markAllRead}
                  className="text-xs font-medium text-accent-600 hover:underline"
                >
                  Прочитать все
                </button>
              </div>
              <div className="max-h-80 overflow-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`border-b border-slate-50 px-4 py-3 ${n.read ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      {!n.read && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                      )}
                      <span className="text-sm font-medium text-slate-800">
                        {n.title}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{n.text}</p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {formatDateTime(n.at)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Link
          href="/mobile"
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 lg:hidden"
          aria-label="Мобильный вид"
        >
          <Icon name="phone" className="h-5 w-5" />
        </Link>

        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
            {currentUserName
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div className="hidden sm:block">
            <div className="text-sm leading-tight font-medium text-slate-800">
              {currentUserName}
            </div>
            <div className="text-[11px] leading-tight text-slate-400">
              {ROLE_LABELS[role]}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
