<script setup lang="ts">
import Card from "./Card.vue";
import { useProductStore } from "../store";
import type { Product } from "../store";
import { getProductWindowUrl } from "../utils/productLink";

withDefaults(
  defineProps<{
    items: Product[];
    /** Search debounce: show skeleton grid */
    loading?: boolean;
  }>(),
  { loading: false }
);

const productStore = useProductStore();

const navigateToProduct = (id: number): void => {
  window.open(getProductWindowUrl(id), "_blank");
};
</script>

<template>
  <!-- Loading (search debounce) -->
  <div v-if="loading" class="card-grid" aria-busy="true" aria-label="Loading results">
    <div v-for="n in 8" :key="'sk-' + n" class="skeleton-card">
      <div class="skeleton-card__media skeleton-shimmer" />
      <div class="skeleton-card__body">
        <div class="skeleton-line skeleton-line--lg skeleton-shimmer" />
        <div class="skeleton-line skeleton-line--sm skeleton-shimmer" />
        <div class="skeleton-line skeleton-line--btn skeleton-shimmer" />
      </div>
    </div>
  </div>

  <div v-else-if="items && items.length > 0" v-auto-animate class="card-grid card-grid--results">
    <div
      v-for="(item, index) in items"
      :key="item.id"
      class="shop-card-reveal"
      :style="{ '--appear-delay': `${Math.min(index, 18) * 42}ms` }"
    >
      <Card
        :item="item"
        :is-favorite="item.isFavorite"
        @add-to-favorite="productStore.addToFavorite(item)"
        @navigate-to-product="navigateToProduct(item.id)"
      />
    </div>
  </div>

  <div v-else class="card-grid__empty fade-in">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1"
      stroke="currentColor"
      class="empty-icon"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z"
      />
    </svg>
    <p class="empty-text">No devices found</p>
    <p class="empty-sub">Try adjusting your search or filters</p>
  </div>
</template>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 16px;
  padding: 28px 40px 40px;
}

.card-grid--results {
  align-items: start;
}

.shop-card-reveal {
  animation: shop-card-reveal 0.65s cubic-bezier(0.22, 1, 0.36, 1) backwards;
  animation-delay: var(--appear-delay, 0ms);
}

@keyframes shop-card-reveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Skeletons */
.skeleton-card {
  display: flex;
  flex-direction: column;
  border-radius: 1rem;
  border: 1px solid rgb(39 39 42);
  background: #0d0d0d;
  overflow: hidden;
  min-height: 280px;
}

.skeleton-card__media {
  aspect-ratio: 4 / 3;
  background: rgb(24 24 27);
}

.skeleton-card__body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.skeleton-line {
  height: 0.75rem;
  border-radius: 0.25rem;
  background: rgb(39 39 42);
}

.skeleton-line--lg {
  width: 75%;
  height: 0.85rem;
}

.skeleton-line--sm {
  width: 45%;
}

.skeleton-line--btn {
  margin-top: 0.35rem;
  height: 2.25rem;
  border-radius: 0.75rem;
  width: 100%;
}

.skeleton-shimmer {
  position: relative;
  overflow: hidden;
}

.skeleton-shimmer::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.07),
    transparent
  );
  animation: skeleton-shimmer 1.35s ease-in-out infinite;
}

@keyframes skeleton-shimmer {
  100% {
    transform: translateX(100%);
  }
}

.card-grid__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 80px 20px;
  color: rgb(82 82 91);
}

.empty-icon {
  width: 48px;
  height: 48px;
  color: rgb(63 63 70);
}

.empty-text {
  font-size: 1rem;
  color: rgb(161 161 170);
}

.empty-sub {
  font-size: 0.8rem;
  color: rgb(113 113 122);
}

@media (max-width: 640px) {
  .card-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    padding: 20px 16px 32px;
    gap: 12px;
  }
}
</style>
