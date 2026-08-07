"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Страница логина сознательно минималистична и не раскрывает
 * структуру системы: только форма ввода пароля.
 */
export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(false);
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.replace("/dashboard");
      router.refresh();
    } else {
      setError(true);
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-950 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-800 text-lg font-bold text-white">
            N
          </div>
          <div className="text-lg font-semibold tracking-tight">Nexora</div>
        </div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Пароль доступа
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
        />
        {error && (
          <p className="mt-2 text-sm text-red-600">Неверный пароль</p>
        )}
        <button
          type="submit"
          disabled={pending || !password}
          className="mt-5 w-full rounded-lg bg-brand-800 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          {pending ? "Проверка…" : "Войти"}
        </button>
      </form>
    </main>
  );
}
