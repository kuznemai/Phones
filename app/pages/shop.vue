<script setup lang="ts">
import type { CatalogFilters, ProductQuery } from "#shared/types";
import { DEMO_NOTICE } from "~/data/site";
import { fetchCatalogFacets, fetchProducts } from "~/services/catalog";
import { PRODUCT_SORTS, parseCatalogQuery, serializeCatalogQuery } from "~/utils/catalog";

const route = useRoute();
const router = useRouter();

// The URL is the source of truth, so filtered views can be shared and bookmarked.
const query = computed(() => parseCatalogQuery(route.query));

const searchInput = ref(query.value.search);
let debounceTimer: ReturnType<typeof setTimeout> | undefined;

function update(patch: Partial<ProductQuery>): void {
  router.replace({ query: serializeCatalogQuery({ ...query.value, ...patch }) });
}

watch(searchInput, (value) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => update({ search: value }), 250);
});

// Back/forward or a link may change the URL from outside the input.
watch(
  () => query.value.search,
  (value) => {
    if (value !== searchInput.value.trim()) searchInput.value = value;
  },
);

onBeforeUnmount(() => clearTimeout(debounceTimer));

const filters = computed<CatalogFilters>({
  get: () => ({
    storage: query.value.storage,
    colors: query.value.colors,
    sizes: query.value.sizes,
    inStockOnly: query.value.inStockOnly,
  }),
  set: (value) => update(value),
});

const activeFilterCount = computed(
  () =>
    query.value.storage.length + query.value.colors.length + query.value.sizes.length + (query.value.inStockOnly ? 1 : 0),
);

function clearFilters(): void {
  clearTimeout(debounceTimer);
  searchInput.value = "";
  router.replace({ query: serializeCatalogQuery({ sort: query.value.sort }) });
}

const { data: facets } = await useAsyncData("catalog-facets", fetchCatalogFacets);

const { data, status, error, refresh } = await useAsyncData("catalog-products", () => fetchProducts(query.value), {
  watch: [query],
});

const products = computed(() => data.value?.items ?? []);
const isLoading = computed(() => status.value === "pending" && !data.value);
const resultLabel = computed(() => {
  const total = data.value?.total ?? 0;
  return `${total} ${total === 1 ? "device" : "devices"}`;
});

const filtersOpen = ref(false);

useSeo({
  title: "Catalog",
  description:
    "Browse every IZ smartphone. Compare screen sizes, storage and colours; every model runs IZ OS with verified boot and encrypted storage.",
});
</script>

<template>
  <div class="iz-wrap iz-page">
    <header class="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="iz-eyebrow">Catalogue</p>
        <h1 class="iz-h1 mt-3">Our devices</h1>
        <p class="mt-3 max-w-xl text-sm text-[var(--iz-muted)] sm:text-base">
          Every model runs IZ OS with the same security features. Pick the size and storage that fit you.
        </p>
      </div>

      <div class="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div class="w-full sm:w-56">
          <label class="iz-label" for="catalog-sort">Sort by</label>
          <select
            id="catalog-sort"
            class="iz-input"
            :value="query.sort"
            @change="update({ sort: ($event.target as HTMLSelectElement).value as ProductQuery['sort'] })"
          >
            <option v-for="option in PRODUCT_SORTS" :key="option.value" :value="option.value">{{ option.label }}</option>
          </select>
        </div>

        <div class="w-full sm:w-64">
          <label class="iz-label" for="catalog-search">Search</label>
          <input
            id="catalog-search"
            v-model="searchInput"
            class="iz-input"
            type="search"
            placeholder="Find a device…"
            autocomplete="off"
            enterkeyhint="search"
            maxlength="80"
          >
        </div>
      </div>
    </header>

    <div class="filters-bar">
      <button
        type="button"
        class="iz-btn iz-btn--ghost filters-bar__toggle"
        :aria-expanded="filtersOpen"
        aria-controls="catalog-filters"
        @click="filtersOpen = !filtersOpen"
      >
        <UiIcon name="filter" />
        Filters<span v-if="activeFilterCount > 0" class="filters-bar__count">{{ activeFilterCount }}</span>
      </button>
      <div
        id="catalog-filters"
        class="filters-bar__panel"
        :class="{ 'filters-bar__panel--open': filtersOpen }"
        role="group"
        aria-label="Filters"
      >
        <ProductFilters v-if="facets" v-model="filters" :facets="facets" @clear="clearFilters" />
      </div>
    </div>

    <div class="layout">
      <section class="layout__results" aria-labelledby="results-heading">
        <div class="results__head">
          <h2 id="results-heading" class="results__count" aria-live="polite">
            <template v-if="!isLoading">{{ resultLabel }}</template>
            <template v-else>Loading devices</template>
          </h2>
          <p class="results__note">{{ DEMO_NOTICE.catalog }}</p>
        </div>

        <UiStateBlock
          v-if="error"
          tone="error"
          title="We could not load the catalog"
          description="Something went wrong while loading devices. Please try again."
        >
          <button type="button" class="iz-btn iz-btn--solid" @click="refresh()">Try again</button>
        </UiStateBlock>

        <ProductGrid v-else :products="products" :loading="isLoading">
          <template #empty>
            <UiStateBlock
              title="No devices match your search"
              :description="
                query.search
                  ? `Nothing matches “${query.search}” with the current filters. Try another word or clear the filters.`
                  : 'No device matches this combination of filters. Try removing one.'
              "
            >
              <button type="button" class="iz-btn iz-btn--solid" @click="clearFilters">Show all devices</button>
            </UiStateBlock>
          </template>
        </ProductGrid>
      </section>
    </div>
  </div>
</template>

<style scoped>
.filters-bar {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--iz-border-soft);
}

.filters-bar :deep(.filters) {
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 1.25rem 2.25rem;
}

.filters-bar__toggle {
  display: none;
}

.filters-bar__count {
  min-width: 1.3rem;
  margin-left: 0.15rem;
  padding: 0 0.35rem;
  border-radius: 999px;
  background: var(--iz-accent-strong);
  color: #04070f;
  font-size: 0.72rem;
  font-weight: 600;
  line-height: 1.3rem;
}

.results__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.25rem 1.5rem;
  margin-bottom: 1rem;
}

.results__count {
  color: var(--iz-muted);
  font-size: 0.85rem;
  font-weight: 400;
}

.results__note {
  color: #6f8095;
  font-size: 0.78rem;
}

@media (max-width: 1023px) {
  .filters-bar {
    padding-bottom: 0;
    border-bottom: 0;
  }

  .filters-bar__toggle {
    display: inline-flex;
  }

  .filters-bar__panel {
    display: none;
    margin-top: 1rem;
    padding: 1.25rem;
    border: 1px solid var(--iz-border);
    border-radius: 1rem;
    background: rgb(255 255 255 / 0.02);
  }

  .filters-bar__panel--open {
    display: block;
  }

  .filters-bar :deep(.filters) {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
