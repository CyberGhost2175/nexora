"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemo } from "@/lib/store";
import { navForRole } from "@/lib/roles";
import { Icon } from "./icons";

export function Sidebar() {
  const { role } = useDemo();
  const pathname = usePathname();
  const items = navForRole(role);

  return (
    <aside className="hidden w-60 shrink-0 flex-col bg-brand-900 text-slate-300 lg:flex">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-base font-bold text-white">
          N
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Nexora CRM</div>
          <div className="text-[11px] text-slate-400">Демо-стенд</div>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 px-3 py-2">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon name={item.icon} className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 px-3 py-3">
        <Link
          href="/mobile"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          <Icon name="phone" className="h-[18px] w-[18px]" />
          Мобильный вид мастера
        </Link>
      </div>
    </aside>
  );
}
