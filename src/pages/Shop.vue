<script setup lang="ts">
import CardList from "../components/CardList.vue";
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { useProductStore } from "../store";

const productStore = useProductStore();

const SEARCH_DEBOUNCE_MS = 320;
const debouncedSearch = ref("");
const isSearchPending = ref(false);
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

const filters = reactive({
  sortBy: "title",
  filterInput: "",
});

/** Skeleton only while typing a non-empty query; clearing search updates instantly */
const showSearchLoading = computed(
  () => isSearchPending.value && filters.filterInput.trim().length > 0
);

const filteredProducts = computed(() => {
  let products = [...productStore?.products];

  if (debouncedSearch.value.trim()) {
    const q = debouncedSearch.value.toLowerCase();
    products = products.filter((product) => product.title.toLowerCase().includes(q));
  }

  if (filters.sortBy) {
    products = products.sort((a, b) => {
      if (filters.sortBy === "price") {
        return a.price - b.price;
      } else if (filters.sortBy === "-price") {
        return b.price - a.price;
      } else {
        return a.title.localeCompare(b.title);
      }
    });
  }
  return products;
});

const onChangeSelect = (event: Event): void => {
  filters.sortBy = (event.target as HTMLSelectElement).value;
};

const onChangeInput = (event: Event): void => {
  filters.filterInput = (event.target as HTMLInputElement).value;

  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = null;
  }

  if (filters.filterInput.trim() === "") {
    debouncedSearch.value = "";
    isSearchPending.value = false;
    return;
  }

  isSearchPending.value = true;
  searchDebounceTimer = setTimeout(() => {
    debouncedSearch.value = filters.filterInput;
    isSearchPending.value = false;
    searchDebounceTimer = null;
  }, SEARCH_DEBOUNCE_MS);
};

onMounted(async () => {
  await productStore.fetchItems();
  productStore.fetchFavorites();
  productStore.loadCartFromLocalStorage();
});

onUnmounted(() => {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
});
</script>

<template>
  <!-- Hero + filters: left copy, right controls on large screens -->
  <div class="px-6 md:px-10 pt-4 pb-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
    <div class="min-w-0 shrink">
      <p class="text-[10px] uppercase tracking-[0.25em] text-[#0C38D4] mb-1 font-medium">Catalogue</p>
      <h1 class="text-3xl text-white font-light mb-2">Our Devices</h1>
      <p class="text-zinc-600 text-sm max-w-xl">Explore the full lineup of crypto-secure smartphones</p>
    </div>

    <div class="flex flex-wrap items-end gap-4 lg:justify-end lg:shrink-0">
      <!-- Sort -->
      <div class="flex flex-col gap-1.5">
        <span class="text-[10px] uppercase tracking-[0.15em] text-zinc-600">Sort by</span>
        <div class="relative">
          <select
            @change="onChangeSelect"
            class="appearance-none bg-black border border-zinc-800 text-zinc-400 py-2 pl-3 pr-8 rounded-lg text-sm outline-none cursor-pointer hover:border-zinc-600 focus:border-zinc-600 transition-colors w-full sm:w-[180px]"
          >
            <option value="title">Name</option>
            <option value="price">Price: low → high</option>
            <option value="-price">Price: high → low</option>
          </select>
          <svg class="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
          </svg>
        </div>
      </div>

      <!-- Search -->
      <div class="flex flex-col gap-1.5 w-full sm:w-auto sm:min-w-[220px] lg:min-w-[260px]">
        <span class="text-[10px] uppercase tracking-[0.15em] text-zinc-600">Search</span>
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z"/>
          </svg>
          <input
            @input="onChangeInput"
            class="w-full bg-black border border-zinc-800 text-white pl-9 pr-3 py-2 rounded-lg text-sm outline-none placeholder:text-zinc-700 hover:border-zinc-600 focus:border-zinc-600 transition-colors"
            type="text"
            placeholder="Find a device..."
          />
        </div>
      </div>
    </div>
  </div>

  <CardList :items="filteredProducts" :loading="showSearchLoading" />
</template>