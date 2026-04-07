<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useProductStore } from "../store";
import { useRouter } from "vue-router";
import OrderCard from "../components/OrderCard.vue";

const store = useProductStore();
const router = useRouter();

type Tab = "orders" | "settings";
const activeTab = ref<Tab>("orders");
const expandedOrderId = ref<number | null>(null);

const userName = ref(localStorage.getItem("profile_name") || "");
const userEmail = ref(localStorage.getItem("profile_email") || "");
const saveSettings = (): void => {
  localStorage.setItem("profile_name", userName.value);
  localStorage.setItem("profile_email", userEmail.value);
  settingsSaved.value = true;
  setTimeout(() => (settingsSaved.value = false), 2000);
};
const settingsSaved = ref(false);
const ordersStatusSyncing = ref(false);

const totalSpent = computed(() => store.orders.reduce((sum, o) => sum + o.totalPrice, 0));

const toggleOrder = (id: number): void => {
  const opening = expandedOrderId.value !== id;
  expandedOrderId.value = opening ? id : null;
  if (opening) void store.refreshOrderStatus(id);
};

const goToShop = (): void => {
  router.push("/shop");
};

const pullOrderStatuses = async (): Promise<void> => {
  ordersStatusSyncing.value = true;
  try {
    await store.syncOrderStatusesFromApi();
  } finally {
    ordersStatusSyncing.value = false;
  }
};

onMounted(() => {
  store.loadOrdersFromLocalStorage();
  store.fetchFavorites();
  void pullOrderStatuses();
});

/** Re-sync when returning to Orders tab */
watch(activeTab, (tab) => {
  if (tab === "orders" && store.orders.length > 0) void pullOrderStatuses();
});
</script>

<template>
  <div class="min-h-screen px-4 py-8 text-white fade-in sm:px-6 md:px-10 md:py-10">
    <div class="flex flex-col gap-6 border-b border-zinc-900 pb-8 sm:flex-row sm:items-center">
      <div
        class="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-8 h-8 text-zinc-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.2"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
      </div>

      <div class="flex-1 min-w-0">
        <h1 class="text-2xl font-light text-white truncate">
          {{ userName || "Guest User" }}
        </h1>
        <p class="text-zinc-600 text-sm mt-0.5">{{ userEmail || "No email set" }}</p>
      </div>

      <div
        class="flex w-full shrink-0 flex-wrap justify-center gap-4 sm:w-auto sm:justify-end sm:gap-6 md:gap-8"
      >
        <div class="flex flex-col items-center">
          <span class="text-xl font-semibold text-white tabular-nums">{{ store.orders.length }}</span>
          <span class="text-[10px] uppercase tracking-wider text-zinc-600 mt-0.5">Orders</span>
        </div>
        <div class="w-px bg-zinc-900"></div>
        <div class="flex flex-col items-center">
          <span class="text-xl font-semibold text-white tabular-nums"
            >${{ totalSpent.toLocaleString() }}</span
          >
          <span class="text-[10px] uppercase tracking-wider text-zinc-600 mt-0.5">Spent</span>
        </div>
        <div class="w-px bg-zinc-900"></div>
        <div class="flex flex-col items-center">
          <span class="text-xl font-semibold text-white tabular-nums">{{ store.favorites.length }}</span>
          <span class="text-[10px] uppercase tracking-wider text-zinc-600 mt-0.5">Saved</span>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-x-4 gap-y-2 mt-6 mb-8 border-b border-zinc-900">
      <div class="flex gap-1">
        <button
          v-for="tab in (['orders', 'settings'] as Tab[])"
          :key="tab"
          @click="activeTab = tab"
          class="px-4 py-2.5 text-sm capitalize transition-colors duration-200 border-b-2 -mb-px"
          :class="
            activeTab === tab
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-zinc-600 hover:text-zinc-400'
          "
        >
          {{ tab }}
        </button>
      </div>
      <span
        v-if="activeTab === 'orders' && ordersStatusSyncing && store.orders.length > 0"
        class="text-[11px] text-zinc-500 tabular-nums"
      >
        Updating order status…
      </span>
    </div>

    <div v-if="activeTab === 'orders'">
      <div v-if="store.orders.length === 0" class="flex flex-col items-center gap-4 py-20 text-zinc-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-14 h-14"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="0.8"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
          />
        </svg>
        <p class="text-lg text-zinc-500">No orders yet</p>
        <p class="text-sm text-zinc-700">Place your first order from the shop</p>
        <button
          @click="goToShop"
          class="mt-2 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-950/50 rounded-lg px-5 py-2 text-sm transition-all"
        >
          Go to Shop
        </button>
      </div>

      <div v-else class="flex flex-col gap-3" v-auto-animate>
        <OrderCard
          v-for="order in store.orders"
          :key="order.id"
          :order="order"
          :expanded="expandedOrderId === order.id"
          @toggle="toggleOrder(order.id)"
          @cancel-order="store.cancelOrder(order.id)"
        />
      </div>
    </div>

    <div v-if="activeTab === 'settings'" class="max-w-md">
      <p class="text-[10px] uppercase tracking-widest text-zinc-700 mb-6">Profile information</p>

      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <label class="text-xs text-zinc-500 uppercase tracking-wider">Display name</label>
          <input
            v-model="userName"
            type="text"
            placeholder="Your name"
            class="bg-black border border-zinc-800 text-white px-3 py-2.5 rounded-lg text-sm outline-none placeholder:text-zinc-700 focus:border-zinc-600 hover:border-zinc-700 transition-colors"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-xs text-zinc-500 uppercase tracking-wider">Email</label>
          <input
            v-model="userEmail"
            type="email"
            placeholder="your@email.com"
            class="bg-black border border-zinc-800 text-white px-3 py-2.5 rounded-lg text-sm outline-none placeholder:text-zinc-700 focus:border-zinc-600 hover:border-zinc-700 transition-colors"
          />
        </div>

        <div class="pt-2 flex items-center gap-4">
          <button
            @click="saveSettings"
            class="bg-indigo-950/50 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/60 hover:border-indigo-400/50 hover:text-indigo-100 rounded-lg px-6 py-2.5 text-sm tracking-wide transition-all duration-200 cursor-pointer"
          >
            Save changes
          </button>
          <Transition name="fade">
            <span v-if="settingsSaved" class="text-xs text-emerald-500">Saved!</span>
          </Transition>
        </div>
      </div>

      <div class="mt-12 pt-6 border-t border-zinc-900">
        <p class="text-[10px] uppercase tracking-widest text-zinc-700 mb-4">Data</p>
        <button
          @click="
            () => {
              store.orders = [];
              store.saveOrdersToLocalStorage();
            }
          "
          class="text-xs text-zinc-600 hover:text-red-400 border border-zinc-800 hover:border-red-900/60 rounded-lg px-4 py-1.5 transition-all duration-200"
        >
          Clear order history
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
