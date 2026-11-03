<script setup lang="ts">
import type { ProductListItem } from "#shared/types";
import { formatInches, formatPrice, formatStorage } from "~/utils/format";
import { useFavoritesStore } from "~/stores/favorites";

const props = withDefaults(defineProps<{ product: ProductListItem; headingLevel?: "h2" | "h3" }>(), {
  headingLevel: "h3",
});

const favorites = useFavoritesStore();
const isSaved = computed(() => favorites.has(props.product.id));

const storageSummary = computed(() => props.product.storageOptionsGb.map(formatStorage).join(" / "));
</script>

<template>
  <article class="card" :class="{ 'card--muted': !product.inStock }" data-testid="product-card">
    <div class="card__media">
      <UiSafeImage
        :src="product.image"
        :alt="product.title"
        :width="320"
        :height="320"
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
      />
      <span v-if="product.badge" class="card__badge">{{ product.badge }}</span>
      <span v-if="!product.inStock" class="card__badge card__badge--muted">Out of stock</span>
    </div>

    <ClientOnly>
      <button
        type="button"
        class="card__fav"
        :class="{ 'card__fav--on': isSaved }"
        :aria-pressed="isSaved"
        :aria-label="`Save ${product.title}`"
        @click="favorites.toggle(product.id)"
      >
        <svg viewBox="0 0 24 24" :fill="isSaved ? 'currentColor' : 'none'" aria-hidden="true">
          <path
            d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 8.2a4.1 4.1 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20Z"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </ClientOnly>

    <div class="card__body">
      <component :is="headingLevel" class="card__title">
        <NuxtLink :to="`/product/${product.slug}`" class="card__link">{{ product.title }}</NuxtLink>
      </component>
      <p class="card__tagline">{{ product.tagline }}</p>

      <ul class="card__specs" aria-label="Key specifications">
        <li>{{ formatInches(product.displayInches) }} display</li>
        <li>{{ product.batteryMah }} mAh</li>
        <li>{{ storageSummary }}</li>
      </ul>

      <div class="card__foot">
        <p class="card__price">
          <span class="card__price-label">From</span>
          <span class="card__price-value" data-testid="card-price">{{ formatPrice(product.fromPriceCents) }}</span>
        </p>
        <ul class="card__colors" :aria-label="`Colours: ${product.colors.map((color) => color.name).join(', ')}`">
          <li
            v-for="color in product.colors"
            :key="color.name"
            class="card__swatch"
            :style="{ background: color.hex }"
            :title="color.name"
          />
        </ul>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card {
  position: relative;
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--iz-border-soft);
  border-radius: 1.1rem;
  background: linear-gradient(180deg, rgb(255 255 255 / 0.035), rgb(255 255 255 / 0.01));
  transition:
    border-color 0.25s ease,
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.card:hover,
.card:focus-within {
  transform: translateY(-4px);
  border-color: rgb(143 192 238 / 0.35);
  box-shadow: 0 18px 40px rgb(0 0 0 / 0.35);
}

.card__media {
  position: relative;
  display: flex;
  aspect-ratio: 1 / 1;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: radial-gradient(70% 60% at 50% 45%, rgb(30 104 200 / 0.18), rgb(0 0 0 / 0) 70%), #000;
}

.card__media :deep(img) {
  max-height: 88%;
  max-width: 88%;
  width: auto;
  height: auto;
  object-fit: contain;
  transition: transform 0.4s ease;
}

.card:hover .card__media :deep(img) {
  transform: scale(1.04);
}

.card--muted .card__media :deep(img) {
  opacity: 0.6;
}

.card__badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  padding: 0.25rem 0.6rem;
  border: 1px solid rgb(143 192 238 / 0.35);
  border-radius: 999px;
  background: rgb(10 20 40 / 0.8);
  color: var(--iz-accent);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.card__badge--muted {
  top: auto;
  bottom: 0.75rem;
  border-color: rgb(255 255 255 / 0.2);
  color: #b4c0cd;
}

.card__fav {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  z-index: 2;
  display: inline-flex;
  height: 2.75rem;
  width: 2.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgb(5 8 15 / 0.65);
  color: #b4c0cd;
  transition:
    color 0.2s ease,
    background-color 0.2s ease;
}

.card__fav:hover {
  color: #fff;
  background: rgb(5 8 15 / 0.9);
}

.card__fav--on {
  color: #f87171;
}

.card__fav svg {
  width: 1.3rem;
  height: 1.3rem;
}

.card__body {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1rem 1.15rem 1.2rem;
}

.card__title {
  color: #fff;
  font-size: 1.05rem;
  font-weight: 600;
}

/* Stretched link: the whole card is one target and one tab stop. */
.card__link::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
}

.card__link:focus-visible {
  outline: none;
}

.card:has(.card__link:focus-visible) {
  outline: 2px solid var(--iz-accent);
  outline-offset: 3px;
}

.card__tagline {
  color: var(--iz-muted);
  font-size: 0.85rem;
  font-weight: 300;
  line-height: 1.45;
}

.card__specs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.5rem;
}

.card__specs li {
  padding: 0.2rem 0.55rem;
  border: 1px solid var(--iz-border-soft);
  border-radius: 999px;
  color: #c3cfdc;
  font-size: 0.74rem;
  white-space: nowrap;
}

.card__foot {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 1rem;
}

.card__price-label {
  display: block;
  color: var(--iz-faint);
  font-size: 0.66rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.card__price-value {
  color: #fff;
  font-size: 1.15rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.card__colors {
  display: flex;
  gap: 0.3rem;
  padding-bottom: 0.3rem;
}

.card__swatch {
  height: 0.9rem;
  width: 0.9rem;
  border: 1px solid rgb(255 255 255 / 0.4);
  border-radius: 999px;
}
</style>
