import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { readStoredJson, writeStoredJson } from "~/utils/storage";

export const FAVORITES_STORAGE_KEY = "iz.favorites.v1";

/** Saved products. A browser-local preference that never leaves the device. */
export const useFavoritesStore = defineStore("favorites", () => {
  const ids = ref<string[]>([]);
  const isHydrated = ref(false);
  const count = computed(() => ids.value.length);

  function has(productId: string): boolean {
    return ids.value.includes(productId);
  }

  function toggle(productId: string): void {
    ids.value = has(productId) ? ids.value.filter((id) => id !== productId) : [...ids.value, productId];
  }

  function hydrate(force = false): void {
    if (isHydrated.value && !force) return;
    isHydrated.value = true;
    const stored = readStoredJson(FAVORITES_STORAGE_KEY);
    ids.value = Array.isArray(stored)
      ? [...new Set(stored.filter((id): id is string => typeof id === "string" && id.length <= 100))].slice(0, 100)
      : [];
  }

  function persist(): void {
    writeStoredJson(FAVORITES_STORAGE_KEY, ids.value);
  }

  return { ids, count, has, toggle, hydrate, persist };
});
