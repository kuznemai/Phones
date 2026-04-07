<script setup lang="ts">
import { ref, watch, onMounted, toRaw } from "vue";
import { RouterLink, useRoute } from "vue-router";
import Buttons from "./Buttons.vue";
import { useProductStore } from "../store";
import type { Product } from "../store";

const route = useRoute();
const productStore = useProductStore();
const product = ref<Product | null>(null);

const loadProduct = (): void => {
  const rawProducts = toRaw(productStore.getAllProducts);
  const productId = route.params.id;
  product.value = rawProducts.find((p) => String(p.id) === String(productId)) ?? null;
};

onMounted(async () => {
  if (!productStore.getAllProducts.length) {
    await productStore.fetchItems();
  }
  loadProduct();
});

watch(
  () => route.params.id,
  async () => {
    if (!productStore.getAllProducts.length) {
      await productStore.fetchItems();
    }
    loadProduct();
  }
);
</script>

<template>
  <div v-if="product" class="fade-in text-white">
    <section class="px-4 py-6 sm:px-6 sm:py-10 md:py-12 lg:px-10">
      <div class="mx-auto max-w-5xl">
        <RouterLink
          to="/shop"
          class="-ml-1 mb-8 inline-flex h-11 w-11 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 sm:h-12 sm:w-12"
          aria-label="Back to shop"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-7 w-7 sm:h-8 sm:w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.75"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </RouterLink>

        <div class="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12 xl:gap-16">
          <!-- Image: no panel — sits on page background -->
          <div class="flex shrink-0 justify-center lg:w-[min(100%,300px)] lg:justify-start xl:w-[320px]">
            <img
              :src="product.imageUrl"
              :alt="product.title"
              class="h-auto max-h-[min(50vh,22rem)] w-auto max-w-[min(100%,240px)] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)] sm:max-h-[26rem] sm:max-w-[280px] lg:max-h-[30rem] lg:max-w-full"
            />
          </div>

          <!-- Content -->
          <div class="flex min-w-0 flex-1 flex-col gap-8 lg:max-w-xl lg:pt-1 xl:max-w-2xl">
            <div class="space-y-5 text-left">
              <h1
                class="text-balance text-2xl font-light leading-snug tracking-tight text-white sm:text-3xl md:text-[2rem] md:leading-tight lg:text-[2.25rem]"
              >
                {{ product.title }}
              </h1>
              <p
                v-if="product.description"
                class="max-w-prose text-base leading-[1.65] text-zinc-400 sm:text-[1.05rem] sm:leading-relaxed"
              >
                {{ product.description }}
              </p>
            </div>

            <div
              class="mt-auto flex flex-col gap-5 border-t border-zinc-800/90 pt-8 sm:flex-row sm:items-end sm:justify-between sm:gap-8"
            >
              <div class="flex flex-col gap-1.5">
                <span class="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">Price</span>
                <b
                  class="price text-3xl font-medium tabular-nums tracking-tight text-white sm:text-4xl lg:text-[2.5rem]"
                >
                  {{ product.price }}
                  <span class="text-xl font-normal text-zinc-500 sm:text-2xl"> $</span>
                </b>
              </div>

              <div
                class="flex h-[3.25rem] min-h-[3.25rem] w-full min-w-0 overflow-hidden rounded-xl border border-indigo-500/30 bg-indigo-950/50 sm:w-auto sm:min-w-[12.5rem]"
              >
                <div
                  v-if="productStore.getCount(product.id) > 0"
                  class="flex h-full w-full min-w-0 px-3"
                >
                  <Buttons :id="product.id" size="lg" />
                </div>
                <button
                  v-else
                  type="button"
                  @click="productStore.addProductToCart(product.id)"
                  class="flex h-full w-full min-w-0 items-center justify-center px-6 text-base font-medium tracking-wide text-indigo-200 transition-colors duration-200 hover:bg-indigo-800/45 hover:text-indigo-50 active:bg-indigo-800/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <div v-else class="fade-in px-4 py-20 text-white sm:px-6">
    <div class="mx-auto max-w-md rounded-2xl border border-zinc-800 bg-zinc-950/50 px-6 py-12 text-center">
      <p class="text-lg text-zinc-400">Product not found</p>
      <RouterLink
        to="/shop"
        class="mt-8 inline-flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-indigo-200"
        aria-label="Back to shop"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.75"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
      </RouterLink>
    </div>
  </div>
</template>
