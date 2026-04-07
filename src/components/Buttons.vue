<script setup lang="ts">
import { computed } from "vue";
import { useProductStore } from "../store";

const cartStore = useProductStore();

const props = withDefaults(
  defineProps<{
    id: number;
    size?: "sm" | "lg";
  }>(),
  { size: "sm" }
);

const isLg = computed(() => props.size === "lg");
</script>
<template>
  <div
    class="flex items-center"
    :class="isLg ? 'h-full w-full min-w-0 gap-0' : ''"
  >
    <button
      type="button"
      @click="cartStore.reduceProductFromCart(id)"
      class="minus cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/35 focus-visible:ring-offset-0"
      :class="isLg
        ? 'flex h-full min-h-0 min-w-0 flex-1 basis-0 items-center justify-center text-base font-medium text-indigo-200'
        : 'rounded-lg px-3 py-1 text-gray-200'"
    >
      -
    </button>

    <span
      class="counter tabular-nums text-white"
      :class="isLg ? 'flex h-full shrink-0 items-center px-1 text-base font-medium text-indigo-100' : 'text-lg'"
    >{{ cartStore.getCount(id) }}</span>

    <button
      type="button"
      @click="cartStore.addProductToCart(id)"
      class="plus cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/35 focus-visible:ring-offset-0"
      :class="isLg
        ? 'flex h-full min-h-0 min-w-0 flex-1 basis-0 items-center justify-center text-base font-medium text-indigo-200'
        : 'rounded-lg px-3 py-1 text-gray-200'"
    >
      +
    </button>
  </div>
</template>
<style scoped>

</style>