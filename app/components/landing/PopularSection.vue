<script setup lang="ts">
import { fetchFeaturedProducts } from "~/services/catalog";

const { data: products, error, refresh } = await useAsyncData("featured-products", () => fetchFeaturedProducts(3), {
  default: () => [],
});
</script>

<template>
  <section id="popular" class="iz-section" aria-labelledby="popular-title">
    <div class="iz-wrap">
      <div class="popular__head iz-reveal">
        <div>
          <p class="iz-eyebrow">Popular devices</p>
          <h2 id="popular-title" class="iz-h2">Pick your IZ phone</h2>
        </div>
        <NuxtLink to="/shop" class="iz-btn iz-btn--ghost">
          <span>View all devices</span>
          <UiIcon name="arrow" />
        </NuxtLink>
      </div>

      <UiStateBlock
        v-if="error"
        tone="error"
        title="We could not load these devices"
        description="Please try again, or open the full catalog."
      >
        <button type="button" class="iz-btn iz-btn--solid" @click="refresh()">Try again</button>
      </UiStateBlock>
      <ProductGrid v-else :products="products" :skeleton-count="3" stretch />

      <p class="popular__note">Prices are sample data for this preview.</p>
    </div>
  </section>
</template>

<style scoped>
.popular__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.25rem 2rem;
  margin-bottom: clamp(1.75rem, 3vw, 2.5rem);
}

.popular__note {
  margin-top: 1rem;
  color: var(--iz-faint);
  font-size: 0.8rem;
}
</style>
