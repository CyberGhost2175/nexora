"use client";

import { useDemo } from "@/lib/store";

export function Toasts() {
  const { toasts } = useDemo();
  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="rounded-lg bg-brand-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg"
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}
