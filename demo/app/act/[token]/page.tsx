import { actIdFromToken, ACTS } from "@/demo-data/acts";
import { ActDocument } from "@/components/ActDocument";

/**
 * Публичная страница акта: доступна без авторизации по share-ссылке.
 * Токен в демо фейковый (без подписи) — он лишь кодирует id акта.
 */
export default async function PublicActPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const actId = actIdFromToken(decodeURIComponent(token));
  const act = ACTS.find((a) => a.id === actId);

  if (!act) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-canvas px-4">
        <p className="text-sm text-slate-500">
          Ссылка на документ недействительна или устарела.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <ActDocument act={act} />
      <p className="mx-auto mt-4 max-w-3xl text-center text-xs text-slate-400">
        Документ сформирован в Nexora CRM
      </p>
    </main>
  );
}
