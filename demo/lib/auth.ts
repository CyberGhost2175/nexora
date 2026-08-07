export const SESSION_COOKIE = "demo_session";

/** Срок жизни demo-сессии в часах (по ссылке-токену и по паролю) */
export const SESSION_TTL_HOURS = 72;

/**
 * DEMO_TOKENS: "токен:метка_лида,токен2:метка2"
 * Возвращает Map токен -> метка.
 */
export function parseTokens(raw: string | undefined): Map<string, string> {
  const map = new Map<string, string>();
  if (!raw) return map;
  for (const pair of raw.split(",")) {
    const [token, label] = pair.trim().split(":");
    if (token) map.set(token, label ?? token);
  }
  return map;
}

/**
 * Допустимые значения cookie: метки токенов + "password".
 * Это демо-стенд, а не боевой продукт: сессия — просто httpOnly cookie
 * с известным значением, без реальной криптографии (сознательно).
 */
export function validSessionValues(): Set<string> {
  const values = new Set<string>(["password"]);
  for (const label of parseTokens(process.env.DEMO_TOKENS).values()) {
    values.add(label);
  }
  return values;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_HOURS * 3600,
  };
}
