<script setup lang="ts">
import { useCartStore } from "~/stores/cart";
import { useCartPreview } from "~/composables/useCartPreview";
import { fetchFeaturedProducts } from "~/services/catalog";

const cart = useCartStore();
const { preview, isLoading, error, refresh } = useCartPreview();

const hasUnavailable = computed(() => preview.value.unavailableCount > 0);
const canCheckout = computed(() => !hasUnavailable.value && preview.value.itemCount > 0);

const { data: suggestions } = useAsyncData("cart-suggestions", () => fetchFeaturedProducts(3), {
  server: false,
  default: () => [],
});

const confirmingClear = ref(false);

function clearCart(): void {
  cart.clear();
  confirmingClear.value = false;
}

useSeo({
  title: "Your cart",
  description: "Review the devices in your cart, change quantities and continue to the checkout preview.",
});
</script>

<template>
  <div class="iz-wrap iz-wrap--narrow iz-page">
    <UiPageHeader eyebrow="Cart" title="Your cart" />

    <ClientOnly>
      <template #fallback>
        <div class="iz-shimmer h-40 rounded-2xl" aria-hidden="true" />
      </template>

      <UiStateBlock
        v-if="error"
        tone="error"
        title="We could not price your cart"
        description="Something went wrong while calculating your total. Your items are still saved in this browser."
      >
        <button type="button" class="iz-btn iz-btn--solid" @click="refresh()">Try again</button>
      </UiStateBlock>

      <div v-else-if="cart.isEmpty" class="empty">
        <UiStateBlock
          title="Your cart is empty"
          description="Browse the catalog, pick a configuration and add it here. Your cart is saved in this browser."
        >
          <NuxtLink to="/shop" class="iz-btn iz-btn--solid">Browse the catalog</NuxtLink>
          <NuxtLink to="/favorites" class="iz-btn iz-btn--ghost">Saved devices</NuxtLink>
        </UiStateBlock>

        <section v-if="suggestions.length" class="empty__suggestions" aria-labelledby="suggestions-heading">
          <h2 id="suggestions-heading" class="empty__title">Popular devices</h2>
          <ProductGrid :products="suggestions" stretch />
        </section>
      </div>

      <div v-else class="cart">
        <section aria-labelledby="cart-items-heading">
          <div class="cart__head">
            <h2 id="cart-items-heading" class="cart__count">
              {{ cart.count }} {{ cart.count === 1 ? "item" : "items" }}
            </h2>
            <div class="cart__clear">
              <template v-if="confirmingClear">
                <span class="cart__clear-question">Remove everything?</span>
                <button type="button" class="iz-btn iz-btn--danger cart__small-btn" @click="clearCart">Yes, clear cart</button>
                <button type="button" class="iz-btn iz-btn--quiet cart__small-btn" @click="confirmingClear = false">Cancel</button>
              </template>
              <button v-else type="button" class="iz-btn iz-btn--quiet cart__small-btn" @click="confirmingClear = true">
                <UiIcon name="trash" />
                Clear cart
              </button>
            </div>
          </div>

          <ul class="cart__lines" :aria-busy="isLoading">
            <CartLine
              v-for="line in preview.lines"
              :key="line.productId + line.variantId"
              :line="line"
              @update:quantity="cart.setQuantity(line.productId, line.variantId, $event)"
              @remove="cart.remove(line.productId, line.variantId)"
            />
          </ul>
        </section>

        <aside class="cart__aside" aria-label="Order summary">
          <CartSummary :totals="preview.totals" delivery-hint="Chosen at checkout">
            <p v-if="hasUnavailable" class="iz-error" role="alert">
              Some items are out of stock. Remove them to continue.
            </p>
            <NuxtLink
              v-if="canCheckout"
              to="/checkout"
              class="iz-btn iz-btn--solid iz-btn--block"
              data-testid="go-to-checkout"
            >
              Continue to checkout
            </NuxtLink>
            <button v-else type="button" class="iz-btn iz-btn--solid iz-btn--block" disabled>Continue to checkout</button>
            <NuxtLink to="/shop" class="iz-btn iz-btn--quiet iz-btn--block">Keep shopping</NuxtLink>
            <p class="cart__note">Prices are sample data. Checkout is a preview and does not place an order.</p>
          </CartSummary>
        </aside>
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped>
.cart {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 21rem;
  align-items: start;
  gap: clamp(1.5rem, 3vw, 2.5rem);
}

.cart__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 1rem;
  margin-bottom: 0.9rem;
}

.cart__count {
  color: var(--iz-muted);
  font-size: 0.9rem;
  font-weight: 400;
}

.cart__clear {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.cart__clear-question {
  color: #dfe8f2;
  font-size: 0.88rem;
}

.cart__small-btn {
  min-height: 2.5rem;
  padding: 0.45rem 1rem;
  font-size: 0.85rem;
}

.cart__lines {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cart__aside {
  position: sticky;
  top: 6rem;
}

.cart__note {
  color: var(--iz-faint);
  font-size: 0.78rem;
  line-height: 1.5;
}

.empty__suggestions {
  margin-top: 1rem;
}

.empty__title {
  margin-bottom: 1.25rem;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 600;
}

@media (max-width: 1023px) {
  .cart {
    grid-template-columns: minmax(0, 1fr);
  }

  .cart__aside {
    position: static;
  }
}
</style>
