<script setup lang="ts">
import Buttons from "./Buttons.vue";
import { useProductStore } from "../store";
import type { Product } from "../store";
import { useRouter } from "vue-router";

const props = defineProps<{
  item: Product;
  isFavorite: boolean;
}>();

const emit = defineEmits<{
  addToFavorite: [item: Product];
}>();

const router = useRouter();
const productStore = useProductStore();

const goToProduct = (): void => {
  void router.push({ name: "CardOfItem", params: { id: String(props.item.id) } });
};
</script>

<template>
  <div
    class="group relative flex h-full min-h-0 w-full flex-1 flex-col bg-[#0d0d0d] border border-zinc-900 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-zinc-800 hover:shadow-[0_16px_48px_rgba(0,0,0,0.7)]"
  >

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

    <!-- Image: fixed min height so card tops align across the row -->
    <div
      class="flex min-h-[11rem] shrink-0 cursor-pointer items-center justify-center bg-zinc-900/40 px-4 py-6"
      @click="goToProduct"
    >
      <img
          :src="item.imageUrl"
          class="w-[88px] h-[128px] object-contain transition-transform duration-300 group-hover:scale-105"
          alt="Product"
      />
    </div>

    <!-- Body -->
    <div class="flex min-h-0 flex-1 flex-col gap-3 p-3.5">
      <p
        class="line-clamp-2 min-h-[2.45rem] cursor-pointer text-[0.8rem] leading-snug text-zinc-400 transition-colors duration-200 hover:text-white"
        @click="goToProduct"
      >
        {{ item.title }}
      </p>

      <!-- Stack until lg: grid often stays 3–4 cols between 768–1023px — too narrow for price + button in one row -->
      <div
        class="mt-auto flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-x-4 lg:gap-y-2"
      >
        <div class="flex min-w-0 flex-col lg:min-w-0 lg:flex-1 lg:pr-1">
          <span class="text-[9px] uppercase tracking-widest text-zinc-700">Price</span>
          <strong
            class="text-[1.1rem] font-semibold leading-tight tracking-tight text-white tabular-nums lg:whitespace-nowrap"
          >
            {{ item.price }}<span class="text-sm font-normal text-zinc-600"> $</span>
          </strong>
        </div>

        <div
          class="flex w-full min-w-0 shrink-0 items-center justify-stretch lg:w-auto lg:justify-end"
        >
          <div
            v-if="productStore.getCount(item.id) > 0"
            class="flex w-full items-center justify-center rounded-lg border border-zinc-800 bg-black px-1 lg:w-auto"
          >
            <Buttons :id="item.id" />
          </div>
          <button
            v-else
            type="button"
            @click="productStore.addProductToCart(item.id)"
            class="w-full min-w-0 cursor-pointer rounded-lg border border-indigo-500/30 bg-indigo-950/50 px-3 py-1.5 text-[0.7rem] tracking-wide text-indigo-200 transition-colors duration-200 hover:bg-indigo-800/45 hover:text-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40 lg:w-auto lg:min-w-[7.25rem] lg:shrink-0 lg:whitespace-nowrap"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>

  </div>
</template>