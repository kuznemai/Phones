<script setup lang="ts">
import Buttons from "./Buttons.vue";
import { useProductStore } from "../store";
import type { Product } from "../store";

const cartStore = useProductStore();

const props = defineProps<{
  item: Product & { quantity: number };
  imageUrl: string;
  title: string;
  price: number;
  quantity: number;
}>();
</script>

<template>
  <div
      class="flex items-center border border-zinc-800 bg-zinc-950/20 p-5 rounded-xl gap-6 md:gap-10"
  >
    <img class="w-16 h-22" :src="imageUrl" :alt="title" />

    <div class="flex flex-col flex-1 text-white min-w-0">
      <p class="text-zinc-200 text-sm md:text-base">{{ title }}</p>

      <div class="flex flex-wrap gap-3 items-center mt-4">
        <b class="text-white tabular-nums">${{ price }}</b>

        <div class="flex items-center border border-zinc-700 rounded-lg overflow-hidden">
          <Buttons :id="item.id" />
        </div>

        <button
          type="button"
          @click="cartStore.removeProductFromCart(item.id)"
          class="ml-auto p-1 rounded-lg opacity-60 hover:opacity-100 transition"
          aria-label="Remove from cart"
        >
          <img src="/close.svg" alt="" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>