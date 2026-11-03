<script setup lang="ts">
import type { ProductListItem } from "#shared/types";

withDefaults(
  defineProps<{
    products: ProductListItem[];
    loading?: boolean;
    skeletonCount?: number;
    headingLevel?: "h2" | "h3";
    /** Stretch a short row (e.g. three featured devices) across the full width. */
    stretch?: boolean;
  }>(),
  { loading: false, skeletonCount: 6, headingLevel: "h3", stretch: false },
);
</script>

<template>
  <div v-if="loading" class="grid" :class="{ 'grid--stretch': stretch }" aria-busy="true" aria-label="Loading devices">
    <div v-for="n in skeletonCount" :key="n" class="skeleton">
      <div class="skeleton__media iz-shimmer" />
      <div class="skeleton__body">
        <div class="skeleton__line iz-shimmer" style="width: 70%" />
        <div class="skeleton__line iz-shimmer" style="width: 45%" />
        <div class="skeleton__line iz-shimmer" style="height: 2.25rem; margin-top: 0.75rem" />
      </div>
    </div>
  </div>

  <ul v-else-if="products.length > 0" class="grid" :class="{ 'grid--stretch': stretch }">
    <li v-for="product in products" :key="product.id">
      <ProductCard :product="product" :heading-level="headingLevel" />
    </li>
  </ul>

  <slot v-else name="empty" />
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr));
  gap: clamp(0.85rem, 1.6vw, 1.35rem);
}

.grid--stretch {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr));
}

.skeleton {
  overflow: hidden;
  border: 1px solid var(--iz-border-soft);
  border-radius: 1.1rem;
}

.skeleton__media {
  aspect-ratio: 1 / 1;
}

.skeleton__body {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1rem 1.1rem 1.4rem;
}

.skeleton__line {
  height: 0.8rem;
  border-radius: 0.35rem;
}
</style>
