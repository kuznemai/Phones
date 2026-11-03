import type { CartPreview, DeliveryMethodId } from "#shared/types";
import { previewCart } from "~/services/cart";
import { useCartStore } from "~/stores/cart";

const EMPTY: CartPreview = {
  lines: [],
  unavailableCount: 0,
  itemCount: 0,
  totals: { currency: "USD", subtotalCents: 0, deliveryCents: 0, totalCents: 0 },
};

/**
 * Priced view of the cart, shared by the cart page and checkout.
 * Client-only: the cart lives in browser storage, so there is nothing to render on
 * the server and no hydration mismatch to guard against.
 */
export function useCartPreview(deliveryMethodId?: Ref<DeliveryMethodId | undefined>) {
  const cart = useCartStore();

  const { data, status, error, refresh } = useAsyncData<CartPreview>(
    // Cart and checkout price differently (checkout adds delivery), so they must not share a cache entry.
    deliveryMethodId ? "cart-preview-with-delivery" : "cart-preview",
    async () => {
      if (cart.items.length === 0) return EMPTY;
      const snapshot = JSON.stringify(cart.items);
      const preview = await previewCart(cart.items, deliveryMethodId?.value);
      // Only reconcile against the cart that was priced; a newer edit re-runs this anyway.
      if (snapshot === JSON.stringify(cart.items)) cart.reconcile(preview.lines);
      return preview;
    },
    {
      server: false,
      default: () => EMPTY,
      // Always re-price on arrival: prices or stock may have changed since the last visit.
      getCachedData: () => undefined,
      // Quantities mutate in place, so watch a stable serialisation of the cart.
      watch: [() => JSON.stringify(cart.items), () => deliveryMethodId?.value],
    },
  );

  return {
    preview: computed(() => (cart.isEmpty ? EMPTY : (data.value ?? EMPTY))),
    isLoading: computed(() => status.value === "pending" && !cart.isEmpty),
    error,
    refresh,
  };
}
