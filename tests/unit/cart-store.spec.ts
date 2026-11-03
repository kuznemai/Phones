import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { CART_STORAGE_KEY, useCartStore } from "~/stores/cart";

/** Minimal in-memory localStorage; `failWrites` simulates a full or blocked storage. */
function installStorage(initial: Record<string, string> = {}, { failWrites = false } = {}) {
  const data = new Map(Object.entries(initial));
  const localStorage = {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      if (failWrites) throw new Error("QuotaExceededError");
      data.set(key, value);
    },
    removeItem: (key: string) => void data.delete(key),
  };
  vi.stubGlobal("window", { localStorage });
  return data;
}

describe("cart store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("starts empty", () => {
    const cart = useCartStore();
    expect(cart.isEmpty).toBe(true);
    expect(cart.count).toBe(0);
  });

  it("merges a repeated add into one line", () => {
    const cart = useCartStore();
    cart.add("p1", "v1");
    cart.add("p1", "v1", 2);

    expect(cart.items).toHaveLength(1);
    expect(cart.quantityOf("p1", "v1")).toBe(3);
    expect(cart.count).toBe(3);
  });

  it("keeps different variants of one product apart", () => {
    const cart = useCartStore();
    cart.add("p1", "v1");
    cart.add("p1", "v2");

    expect(cart.items).toHaveLength(2);
    expect(cart.count).toBe(2);
  });

  it("caps the quantity per line", () => {
    const cart = useCartStore();
    cart.add("p1", "v1", 50);
    expect(cart.quantityOf("p1", "v1")).toBe(10);

    cart.setQuantity("p1", "v1", 99);
    expect(cart.quantityOf("p1", "v1")).toBe(10);
  });

  it("ignores non-numeric quantity updates", () => {
    const cart = useCartStore();
    cart.add("p1", "v1", 2);
    cart.setQuantity("p1", "v1", Number.NaN);
    expect(cart.quantityOf("p1", "v1")).toBe(2);
  });

  it("removes the line when the quantity drops to zero", () => {
    const cart = useCartStore();
    cart.add("p1", "v1");
    cart.setQuantity("p1", "v1", 0);

    expect(cart.items).toHaveLength(0);
    expect(cart.isEmpty).toBe(true);
  });

  it("derives count from items rather than tracking it separately", () => {
    const cart = useCartStore();
    cart.add("p1", "v1", 2);
    cart.add("p2", "v9", 3);
    cart.remove("p1", "v1");

    expect(cart.count).toBe(3);
  });

  it("clears everything", () => {
    const cart = useCartStore();
    cart.add("p1", "v1");
    cart.clear();

    expect(cart.isEmpty).toBe(true);
  });

  it("reconciles with priced lines: unknown lines go, clamped quantities stick", () => {
    const cart = useCartStore();
    cart.add("p1", "v1", 5);
    cart.add("gone", "v", 1);

    cart.reconcile([{ productId: "p1", variantId: "v1", quantity: 3 }]);

    expect(cart.items).toEqual([{ productId: "p1", variantId: "v1", quantity: 3 }]);
  });

  describe("persistence", () => {
    it("survives a reload: persist, then hydrate a fresh store", () => {
      const data = installStorage();
      const cart = useCartStore();
      cart.add("p1", "v1", 2);
      cart.persist();

      setActivePinia(createPinia());
      const reloaded = useCartStore();
      reloaded.hydrate();

      expect(data.has(CART_STORAGE_KEY)).toBe(true);
      expect(reloaded.items).toEqual([{ productId: "p1", variantId: "v1", quantity: 2 }]);
    });

    it("discards a stored value that is not valid JSON", () => {
      const data = installStorage({ [CART_STORAGE_KEY]: "{not json" });
      const cart = useCartStore();
      cart.hydrate();

      expect(cart.items).toEqual([]);
      expect(data.has(CART_STORAGE_KEY)).toBe(true); // unreadable, left for the next persist to overwrite
    });

    it("keeps the valid lines of a partly corrupted cart and rewrites it", () => {
      const data = installStorage({
        [CART_STORAGE_KEY]: JSON.stringify([{ productId: "p1", variantId: "v1", quantity: 1 }, { productId: 5 }]),
      });
      const cart = useCartStore();
      cart.hydrate();

      expect(cart.items).toEqual([{ productId: "p1", variantId: "v1", quantity: 1 }]);
      expect(data.has(CART_STORAGE_KEY)).toBe(false);
    });

    it("does not throw when storage refuses writes", () => {
      installStorage({}, { failWrites: true });
      const cart = useCartStore();
      cart.add("p1", "v1");
      expect(() => cart.persist()).not.toThrow();
      expect(cart.count).toBe(1);
    });

    it("works without any storage at all", () => {
      const cart = useCartStore();
      expect(() => cart.hydrate()).not.toThrow();
      expect(cart.isEmpty).toBe(true);
    });

    it("re-reads storage when another tab changes it", () => {
      const data = installStorage();
      const cart = useCartStore();
      cart.hydrate();

      data.set(CART_STORAGE_KEY, JSON.stringify([{ productId: "p2", variantId: "v2", quantity: 4 }]));
      cart.hydrate(true);
      expect(cart.count).toBe(4);

      data.delete(CART_STORAGE_KEY);
      cart.hydrate(true);
      expect(cart.isEmpty).toBe(true);
    });
  });
});
