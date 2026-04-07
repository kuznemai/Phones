/**
 * Разрешить только внутренние пути приложения (без open redirect).
 */
export function getSafeRedirectPath(raw: unknown, fallback = "/shop"): string {
  if (typeof raw !== "string" || raw.length === 0) return fallback;

  const decoded = decodeURIComponent(raw.trim());

  if (!decoded.startsWith("/") || decoded.startsWith("//")) return fallback;
  if (decoded.includes("://")) return fallback;

  return decoded;
}
