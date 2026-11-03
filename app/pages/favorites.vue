<script setup lang="ts">
import { fetchProducts } from "~/services/catalog";
import { useFavoritesStore } from "~/stores/favorites";

const favorites = useFavoritesStore();

// The catalog is a handful of devices, so filter the full list against the saved ids.
const { data, status, error, refresh } = useAsyncData("favorites-catalog", () => fetchProducts(), {
  server: false,
  default: () => ({ items: [], total: 0 }),
});

const saved = computed(() => data.value.items.filter((product) => favorites.has(product.id)));

useSeo({ title: "Saved devices", description: "The IZ devices you saved for later in this browser." });
useHead({ meta: [{ name: "robots", content: "noindex" }] });
</script>

<template>
  <div class="iz-wrap iz-page">
    <UiPageHeader
      eyebrow="Saved"
      title="Saved devices"
      lead="Devices you saved with the heart button. They are stored in this browser only."
    />

    <UiStateBlock
      v-if="error"
      tone="error"
      title="We could not load your saved devices"
      description="Something went wrong. Please try again."
    >
      <button type="button" class="iz-btn iz-btn--solid" @click="refresh()">Try again</button>
    </UiStateBlock>

    <ClientOnly v-else>
      <template #fallback>
        <ProductGrid :products="[]" loading :skeleton-count="3" />
      </template>
      <ProductGrid :products="saved" :loading="status === 'pending'" :skeleton-count="3">
        <template #empty>
          <UiStateBlock title="Nothing saved yet" description="Tap the heart on any device to keep it here for later.">
            <NuxtLink to="/shop" class="iz-btn iz-btn--solid">Browse the catalog</NuxtLink>
          </UiStateBlock>
        </template>
      </ProductGrid>
    </ClientOnly>
  </div>
</template>
