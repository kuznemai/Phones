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
    <UiPageHeader
      eyebrow="Catalog"
      title="Smartphones running IZ OS"
      lead="Every model ships with the same privacy-focused operating system. Choose the size, battery and storage that suit you."
    />

    <UiNotice class="mb-8">{{ DEMO_NOTICE.catalog }}</UiNotice>

    <div class="toolbar">
      <div class="toolbar__search">
        <label class="sr-only" for="catalog-search">Search devices</label>
        <UiIcon name="search" class="toolbar__search-icon" />
        <input
          id="catalog-search"
          v-model="searchInput"
          class="iz-input toolbar__search-input"
          type="search"
          placeholder="Search by name or feature"
          autocomplete="off"
          enterkeyhint="search"
          maxlength="80"
        >
      </div>

      <div class="toolbar__controls">
        <button
          type="button"
          class="iz-btn iz-btn--ghost toolbar__filter-toggle"
          :aria-expanded="filtersOpen"
          aria-controls="catalog-filters"
          @click="filtersOpen = !filtersOpen"
        >
          <UiIcon name="filter" />
          Filters<span v-if="activeFilterCount > 0" class="toolbar__count">{{ activeFilterCount }}</span>
        </button>

        <div class="toolbar__sort">
          <label class="iz-label toolbar__sort-label" for="catalog-sort">Sort by</label>
          <select
            id="catalog-sort"
            class="iz-input"
            :value="query.sort"
            @change="update({ sort: ($event.target as HTMLSelectElement).value as ProductQuery['sort'] })"
          >
            <option v-for="option in PRODUCT_SORTS" :key="option.value" :value="option.value">{{ option.label }}</option>
          </select>
        </div>
      </div>
    </div>

    <div class="layout">
      <aside
        id="catalog-filters"
        class="layout__filters"
        :class="{ 'layout__filters--open': filtersOpen }"
        aria-label="Filters"
      >
        <ProductFilters v-if="facets" v-model="filters" :facets="facets" @clear="clearFilters" />
      </aside>

      <section class="layout__results" aria-labelledby="results-heading">
        <h2 id="results-heading" class="results__count" aria-live="polite">
          <template v-if="!isLoading">{{ resultLabel }}</template>
          <template v-else>Loading devices</template>
        </h2>

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
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.75rem;
}

.toolbar__search {
  position: relative;
  flex: 1 1 18rem;
  max-width: 30rem;
}

.toolbar__search-icon {
  position: absolute;
  top: 50%;
  left: 0.95rem;
  width: 1.1rem;
  height: 1.1rem;
  color: var(--iz-muted);
  transform: translateY(-50%);
  pointer-events: none;
}

.toolbar__search-input {
  padding-left: 2.6rem;
}

.toolbar__controls {
  display: flex;
  align-items: end;
  gap: 0.75rem;
}

.toolbar__sort {
  width: 13.5rem;
}

.toolbar__count {
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

.layout {
  display: grid;
  grid-template-columns: 15.5rem minmax(0, 1fr);
  align-items: start;
  gap: clamp(1.5rem, 3vw, 2.75rem);
}

.layout__filters {
  position: sticky;
  top: 6rem;
}

.results__count {
  margin-bottom: 1rem;
  color: var(--iz-muted);
  font-size: 0.85rem;
  font-weight: 400;
}

.toolbar__filter-toggle {
  display: none;
}

@media (max-width: 1023px) {
  .layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .toolbar__filter-toggle {
    display: inline-flex;
  }

  .layout__filters {
    position: static;
    display: none;
    padding: 1.25rem;
    border: 1px solid var(--iz-border);
    border-radius: 1rem;
    background: rgb(255 255 255 / 0.02);
  }

  .layout__filters--open {
    display: block;
  }
}

@media (max-width: 560px) {
  .toolbar__search {
    max-width: none;
    flex-basis: 100%;
  }

  .toolbar__controls {
    width: 100%;
  }

  .toolbar__sort {
    flex: 1;
    width: auto;
  }

  .toolbar__sort-label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }
}
</style>
