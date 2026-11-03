/**
 * localStorage access that never throws. Storage can be missing (SSR), blocked
 * (privacy settings, some embedded browsers), full, or hold a value someone edited by
 * hand — callers get `undefined` / `false` instead of an exception.
 */

function storage(): Storage | undefined {
  try {
    return typeof window === "undefined" ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
}

/** Parsed JSON, or `undefined` when the key is absent, unreadable or not valid JSON. */
export function readStoredJson(key: string): unknown {
  try {
    const raw = storage()?.getItem(key);
    return raw == null ? undefined : JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export function writeStoredJson(key: string, value: unknown): boolean {
  try {
    const target = storage();
    if (!target) return false;
    target.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeStored(key: string): void {
  try {
    storage()?.removeItem(key);
  } catch {
    // Nothing to clean up if storage is unavailable.
  }
}
