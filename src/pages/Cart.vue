<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useProductStore } from "../store";
import CartItemList from "../components/CartItemList.vue";

const store = useProductStore();
const router = useRouter();

const isCreatingOrder = ref(false);
const placedOrderId = ref<number | null>(null);
const orderError = ref<string | null>(null);

const subtotal = computed(() => store.getTheTotalPrice());
const vat = computed(() => Number((subtotal.value * 0.05).toFixed(2)));
const total = computed(() => subtotal.value + vat.value);

onMounted(async () => {
  store.loadCartFromLocalStorage();
  if (store.products.length === 0) {
    await store.fetchItems();
  }
});

const handlePlaceOrder = async (): Promise<void> => {
  isCreatingOrder.value = true;
  orderError.value = null;
  try {
    const data = (await store.createOrder()) as { id?: number };
    placedOrderId.value = data?.id ?? store.orders[0]?.id ?? null;
  } catch {
    orderError.value = "Could not place order. Please try again.";
  } finally {
    isCreatingOrder.value = false;
  }
};

const continueShopping = (): void => {
  router.push("/shop");
};

const goProfile = (): void => {
  router.push("/profile");
};
</script>

<template>
  <div class="min-h-screen px-6 md:px-10 py-10 text-white fade-in">
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-8 border-b border-zinc-900">
      <div>
        <p class="text-[10px] uppercase tracking-widest text-zinc-600 mb-2">Checkout</p>
        <h1 class="text-2xl md:text-3xl font-light text-white">Cart</h1>
        <p class="text-zinc-600 text-sm mt-2 max-w-xl">
          Review items and place your order. After checkout you can track everything in Profile.
        </p>
      </div>
      <button
        type="button"
        @click="continueShopping"
        class="text-sm text-indigo-400 hover:text-indigo-300 border border-indigo-500/25 hover:border-indigo-400/40 rounded-lg px-4 py-2 transition-colors self-start sm:self-auto"
      >
        Continue shopping
      </button>
    </div>

    <!-- Success -->
    <div v-if="placedOrderId != null" class="max-w-lg mx-auto py-16 flex flex-col items-center text-center gap-6">
      <div
        class="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-8 h-8 text-emerald-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <div>
        <h2 class="text-xl font-medium text-white">Order placed</h2>
        <p class="text-zinc-500 mt-2 text-sm">
          Your order number is
          <span class="text-zinc-300 font-mono">#{{ placedOrderId }}</span
          >. Open Profile to see full details and status.
        </p>
      </div>
      <div class="flex flex-wrap gap-3 justify-center">
        <button
          type="button"
          @click="goProfile"
          class="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-6 py-3 text-sm transition-colors"
        >
          View in Profile
        </button>
        <button
          type="button"
          @click="continueShopping"
          class="border border-zinc-700 hover:border-zinc-600 text-zinc-300 rounded-xl px-6 py-3 text-sm transition-colors"
        >
          Back to shop
        </button>
      </div>
    </div>

    <!-- Empty -->
    <div
      v-else-if="store.cart.length === 0"
      class="max-w-md mx-auto py-20 flex flex-col items-center text-center gap-4"
    >
      <div class="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-7 h-7 text-zinc-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
          />
        </svg>
      </div>
      <h2 class="text-lg text-zinc-400">Your cart is empty</h2>
      <p class="text-sm text-zinc-600">Add devices from the catalogue to continue.</p>
      <button
        type="button"
        @click="continueShopping"
        class="mt-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-6 py-2.5 text-sm transition-colors"
      >
        Browse shop
      </button>
    </div>

    <!-- Cart contents -->
    <div v-else class="mt-8 flex flex-col lg:flex-row gap-10 lg:gap-12">
      <div class="flex-1 min-w-0">
        <p class="text-[10px] uppercase tracking-widest text-zinc-600 mb-4">Items</p>
        <CartItemList />
      </div>

      <aside class="w-full lg:w-80 shrink-0">
        <div
          class="sticky top-6 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 flex flex-col gap-4"
        >
          <p class="text-[10px] uppercase tracking-widest text-zinc-600">Summary</p>

          <div class="flex justify-between text-sm text-zinc-400">
            <span>Subtotal</span>
            <span class="text-white tabular-nums">${{ subtotal.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between text-sm text-zinc-400">
            <span>VAT (5%)</span>
            <span class="text-white tabular-nums">${{ vat.toLocaleString() }}</span>
          </div>
          <div class="h-px bg-zinc-800"></div>
          <div class="flex justify-between text-base font-medium">
            <span class="text-zinc-300">Total</span>
            <span class="text-white tabular-nums">${{ total.toLocaleString() }}</span>
          </div>

          <p v-if="orderError" class="text-sm text-red-400">{{ orderError }}</p>

          <button
            type="button"
            :disabled="isCreatingOrder"
            @click="handlePlaceOrder"
            class="mt-2 w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 text-sm font-medium transition-colors"
          >
            {{ isCreatingOrder ? "Placing order…" : "Place order" }}
          </button>

          <p class="text-xs text-zinc-600 leading-relaxed">
            By placing an order you’ll see it under Profile → Orders with tracking steps.
          </p>
        </div>
      </aside>
    </div>
  </div>
</template>
