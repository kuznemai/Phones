import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { CartItemInput } from "#shared/types";
import { MAX_QUANTITY_PER_LINE, sanitizeCartItems } from "~/utils/cart";
import { readStoredJson, removeStored, writeStoredJson } from "~/utils/storage";

export const CART_STORAGE_KEY = "iz.cart.v1";

function sameLine(item: CartItemInput, productId: string, variantId: string): boolean {
  return item.productId === productId && item.variantId === variantId;
}

/**
 * Holds only ids and quantities — every price the shopper sees is derived from the
 * catalog by `previewCart`, so the cart cannot drift out of sync with it.
 */
export const useCartStore = defineStore("cart", () => {
  const items = ref<CartItemInput[]>([]);
  const isHydrated = ref(false);

  const count = computed(() => items.value.reduce((total, item) => total + item.quantity, 0));
  const isEmpty = computed(() => items.value.length === 0);

  function quantityOf(productId: string, variantId: string): number {
    return items.value.find((item) => sameLine(item, productId, variantId))?.quantity ?? 0;
  }

  function add(productId: string, variantId: string, quantity = 1): void {
    const amount = Math.max(1, Math.trunc(quantity) || 1);
    const existing = items.value.find((item) => sameLine(item, productId, variantId));
    if (existing) {
      existing.quantity = Math.min(existing.quantity + amount, MAX_QUANTITY_PER_LINE);
      return;
    }
    items.value.push({ productId, variantId, quantity: Math.min(amount, MAX_QUANTITY_PER_LINE) });
  }

  function setQuantity(productId: string, variantId: string, quantity: number): void {
    if (!Number.isFinite(quantity)) return;
    const next = Math.min(Math.max(Math.trunc(quantity), 0), MAX_QUANTITY_PER_LINE);
    if (next <= 0) {
      remove(productId, variantId);
      return;
    }
    const existing = items.value.find((item) => sameLine(item, productId, variantId));
    if (existing) existing.quantity = next;
  }

  function remove(productId: string, variantId: string): void {
    items.value = items.value.filter((item) => !sameLine(item, productId, variantId));
  }

  function clear(): void {
    items.value = [];
  }

  /**
   * Aligns the cart with what pricing returned: drops lines whose product no longer
   * exists and adopts clamped quantities (for example when stock is limited).
   */
  function reconcile(lines: CartItemInput[]): void {
    const next = items.value.flatMap((item) => {
      const line = lines.find((candidate) => sameLine(candidate, item.productId, item.variantId));
      return line ? [{ ...item, quantity: line.quantity }] : [];
    });
    const changed =
      next.length !== items.value.length || next.some((item, index) => item.quantity !== items.value[index]!.quantity);
    if (changed) items.value = next;
  }

  /**
   * Restores the cart from localStorage. Client-only: called from a plugin, and again
   * when another tab changes the stored cart. A corrupted value is discarded.
   */
  function hydrate(force = false): void {
    if (isHydrated.value && !force) return;
    isHydrated.value = true;

    const stored = readStoredJson(CART_STORAGE_KEY);
    if (stored === undefined) {
      if (force) items.value = [];
      return;
    }
    const sanitized = sanitizeCartItems(stored);
    if (!Array.isArray(stored) || sanitized.length !== stored.length) removeStored(CART_STORAGE_KEY);
    items.value = sanitized;
  }

  function persist(): void {
    // Private mode or a full quota: the cart still works for this visit.
    writeStoredJson(CART_STORAGE_KEY, items.value);
  }

  return {
    items,
    isHydrated,
    count,
    isEmpty,
    quantityOf,
    add,
    setQuantity,
    remove,
    clear,
    reconcile,
    hydrate,
    persist,
  };
});
