import { CART_STORAGE_KEY, useCartStore } from "~/stores/cart";
import { FAVORITES_STORAGE_KEY, useFavoritesStore } from "~/stores/favorites";

/** Browser storage only exists on the client, so restoring/saving happens here. */
export default defineNuxtPlugin(() => {
  const cart = useCartStore();
  const favorites = useFavoritesStore();

  cart.hydrate();
  favorites.hydrate();

  watch(() => cart.items, () => cart.persist(), { deep: true });
  watch(() => favorites.ids, () => favorites.persist(), { deep: true });

  // Keeps several open tabs in step: another tab wrote, so re-read.
  window.addEventListener("storage", (event) => {
    if (event.key === CART_STORAGE_KEY || event.key === null) cart.hydrate(true);
    if (event.key === FAVORITES_STORAGE_KEY || event.key === null) favorites.hydrate(true);
  });
});
