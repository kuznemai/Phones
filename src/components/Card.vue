<script setup lang="ts">
import Buttons from "./Buttons.vue";
import { useProductStore } from "../store";
import type { Product } from "../store";
import { getProductWindowUrl } from "../utils/productLink";

const props = defineProps<{
  item: Product;
  isFavorite: boolean;
}>();

const emit = defineEmits<{
  addToFavorite: [item: Product];
  navigateToProduct: [id: number];
}>();

const productStore = useProductStore();

const handleTitleClick = (): void => {
  window.open(getProductWindowUrl(props.item.id), "_blank");
};
</script>

<template>
  <div class="group relative flex flex-col bg-[#0d0d0d] border border-zinc-900 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-zinc-800 hover:shadow-[0_16px_48px_rgba(0,0,0,0.7)]">

    <!-- Favourite -->
    <svg
        @click="emit('addToFavorite', item)"
        class="absolute top-3 right-3 w-7 h-7 z-10 cursor-pointer transition-transform duration-200 hover:scale-125"
        viewBox="0 0 34 34"
        xmlns="http://www.w3.org/2000/svg"
        :fill="isFavorite ? '#e05252' : 'none'"
        :stroke="isFavorite ? '#e05252' : '#3f3f46'"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/>
    </svg>

    <!-- Image -->
    <div class="flex items-center justify-center bg-zinc-900/40 px-4 py-6 cursor-pointer" @click="handleTitleClick">
      <img
          :src="item.imageUrl"
          class="w-[88px] h-[128px] object-contain transition-transform duration-300 group-hover:scale-105"
          alt="Product"
      />
    </div>

    <!-- Body -->
    <div class="flex flex-col flex-1 gap-3 p-3.5">
      <p
          class="text-[0.8rem] text-zinc-400 leading-snug cursor-pointer hover:text-white transition-colors duration-200 line-clamp-2"
          @click="handleTitleClick"
      >{{ item.title }}</p>

      <div class="flex items-end justify-between mt-auto gap-2">
        <!-- Price -->
        <div class="flex flex-col min-w-0">
          <span class="text-[9px] uppercase tracking-widest text-zinc-700">Price</span>
          <strong class="text-[1.1rem] font-semibold text-white leading-tight tracking-tight whitespace-nowrap tabular-nums">
            {{ item.price }}<span class="text-sm font-normal text-zinc-600"> $</span>
          </strong>
        </div>

        <!-- Actions -->
        <div class="flex items-center shrink-0">
          <div v-if="productStore.getCount(item.id) > 0" class="flex items-center border border-zinc-800 rounded-lg px-1 bg-black">
            <Buttons :id="item.id" />
          </div>
          <button
              v-else
              type="button"
              @click="productStore.addProductToCart(item.id)"
              class="min-w-[7.25rem] shrink-0 cursor-pointer overflow-hidden whitespace-nowrap rounded-lg border border-indigo-500/30 bg-indigo-950/50 px-3.5 py-1.5 text-[0.7rem] tracking-wide text-indigo-200 transition-colors duration-200 hover:bg-indigo-800/45 hover:text-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>

  </div>
</template>