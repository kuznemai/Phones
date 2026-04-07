<script setup lang="ts">
import type { OrderRecord, OrderStatus } from "../store";

defineProps<{
  order: OrderRecord;
  expanded: boolean;
}>();

defineEmits<{ toggle: []; "cancel-order": [] }>();

const STATUS_STEPS: OrderStatus[] = ["placed", "processing", "shipped", "delivered"];
const STATUS_LABELS: Record<OrderStatus, string> = {
  placed: "Placed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
};
const STATUS_ICONS: Record<OrderStatus, string> = {
  placed:
    "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2",
  processing:
    "M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75",
  shipped:
    "M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-1.5-3.75h13.5m-13.5 0H3m16.5 0h.75m-.75 0v-2.25m0 0h-13.5M3 12V4.5a1.5 1.5 0 0 1 1.5-1.5h13.5A1.5 1.5 0 0 1 19.5 4.5V12M15.75 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-1.5-3.75h4.5",
  delivered: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
};

const STATUS_BADGE: Record<OrderStatus, string> = {
  placed: "bg-zinc-800 text-zinc-400",
  processing: "bg-blue-950/60 text-blue-300 border border-blue-800/40",
  shipped: "bg-indigo-950/60 text-indigo-300 border border-indigo-700/40",
  delivered: "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40",
};

const currentStepIndex = (status: OrderStatus): number => STATUS_STEPS.indexOf(status);

const stepState = (
  status: OrderStatus,
  stepIdx: number
): "done" | "active" | "pending" => {
  const cur = currentStepIndex(status);
  if (stepIdx < cur) return "done";
  if (stepIdx === cur) return "active";
  return "pending";
};

const formatDate = (iso: string): string =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(iso)
  );
</script>

<template>
  <div
    class="border border-zinc-900 rounded-2xl overflow-hidden transition-colors duration-200 hover:border-zinc-800"
  >
    <button
      type="button"
      @click="$emit('toggle')"
      class="w-full flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 px-5 py-4 text-left"
    >
      <div class="flex items-center gap-4 flex-1 min-w-0">
        <div class="flex flex-col shrink-0">
          <span class="text-[10px] uppercase tracking-wider text-zinc-700">Order</span>
          <span class="text-white font-mono font-medium">#{{ order.id }}</span>
        </div>

        <div class="flex flex-col shrink-0">
          <span class="text-[10px] uppercase tracking-wider text-zinc-700">Date</span>
          <span class="text-zinc-400 text-sm">{{ formatDate(order.createdAt) }}</span>
        </div>

        <div class="flex items-center gap-2 min-w-0 flex-1 hidden sm:flex">
          <img
            v-for="item in order.items.slice(0, 3)"
            :key="item.id"
            :src="item.imageUrl"
            :alt="item.title"
            class="w-8 h-10 object-contain bg-zinc-900/60 rounded-lg"
          />
          <span v-if="order.items.length > 3" class="text-zinc-600 text-xs"
            >+{{ order.items.length - 3 }}</span
          >
        </div>
      </div>

      <div class="flex items-center gap-4 shrink-0">
        <div class="flex flex-col items-end">
          <span class="text-[10px] uppercase tracking-wider text-zinc-700">Total</span>
          <span class="text-white font-semibold tabular-nums">${{ order.totalPrice }}</span>
        </div>

        <span
          class="text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-md"
          :class="STATUS_BADGE[order.status]"
        >
          {{ STATUS_LABELS[order.status] }}
        </span>

        <svg
          class="w-4 h-4 text-zinc-600 transition-transform duration-200 shrink-0"
          :class="expanded ? 'rotate-180' : ''"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </button>

    <div v-if="expanded" class="border-t border-zinc-900 px-5 pb-5 pt-4 flex flex-col gap-6">
      <div>
        <p class="text-[10px] uppercase tracking-widest text-zinc-700 mb-4">Tracking</p>
        <div class="flex items-start gap-0">
          <template v-for="(step, idx) in STATUS_STEPS" :key="step">
            <div class="flex flex-col items-center gap-1.5 flex-1">
              <div
                class="w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300"
                :class="{
                  'bg-emerald-500/10 border-emerald-500/60': stepState(order.status, idx) === 'done',
                  'bg-indigo-500/15 border-indigo-500': stepState(order.status, idx) === 'active',
                  'bg-zinc-900 border-zinc-800': stepState(order.status, idx) === 'pending',
                }"
              >
                <svg
                  class="w-4 h-4 transition-colors duration-300"
                  :class="{
                    'text-emerald-400': stepState(order.status, idx) === 'done',
                    'text-indigo-400': stepState(order.status, idx) === 'active',
                    'text-zinc-700': stepState(order.status, idx) === 'pending',
                  }"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" :d="STATUS_ICONS[step]" />
                </svg>
              </div>
              <span
                class="text-[10px] uppercase tracking-wider text-center transition-colors duration-300"
                :class="{
                  'text-emerald-500': stepState(order.status, idx) === 'done',
                  'text-indigo-400': stepState(order.status, idx) === 'active',
                  'text-zinc-700': stepState(order.status, idx) === 'pending',
                }"
                >{{ STATUS_LABELS[step] }}</span
              >
            </div>
            <div
              v-if="idx < STATUS_STEPS.length - 1"
              class="flex-1 h-px mt-4.5 self-start"
              style="margin-top: 18px"
              :class="
                stepState(order.status, idx) === 'done' ? 'bg-emerald-800/60' : 'bg-zinc-800'
              "
            ></div>
          </template>
        </div>
      </div>

      <div>
        <p class="text-[10px] uppercase tracking-widest text-zinc-700 mb-3">Items</p>
        <div class="flex flex-col gap-2">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="flex items-center gap-4 bg-zinc-900/30 rounded-xl px-4 py-3"
          >
            <img :src="item.imageUrl" :alt="item.title" class="w-10 h-14 object-contain shrink-0" />
            <div class="flex-1 min-w-0">
              <p class="text-sm text-zinc-300 truncate">{{ item.title }}</p>
              <p class="text-xs text-zinc-600 mt-0.5">qty: {{ item.quantity }}</p>
            </div>
            <span class="text-sm font-semibold text-white tabular-nums shrink-0">
              ${{ (item.price * item.quantity).toLocaleString() }}
            </span>
          </div>
        </div>

        <div class="flex justify-end items-center gap-3 mt-3 pt-3 border-t border-zinc-900">
          <span class="text-xs text-zinc-600 uppercase tracking-wider">Order total</span>
          <span class="text-lg font-semibold text-white tabular-nums"
            >${{ order.totalPrice.toLocaleString() }}</span
          >
        </div>
      </div>

      <div v-if="order.status === 'placed'" class="flex justify-end">
        <button
          type="button"
          @click.stop="$emit('cancel-order')"
          class="text-xs text-zinc-600 hover:text-red-400 border border-zinc-800 hover:border-red-900/60 rounded-lg px-4 py-1.5 transition-all duration-200"
        >
          Cancel order
        </button>
      </div>
    </div>
  </div>
</template>
