<script setup>
import CardList from "../components/CardList.vue";
import {computed, onMounted, reactive} from "vue";
import {useProductStore} from "../store.js";

const productStore = useProductStore();

const filters = reactive({
  sortBy: "title",
  filterInput: "",
});

const filteredProducts = computed(() => {
  let products = [...productStore?.products];

  if (filters.filterInput) {
    products = products.filter(product => {
      return product.title.toLowerCase().includes(filters.filterInput.toLowerCase());
    });
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

const onChangeSelect = (event) => {
  filters.sortBy = event.target.value;
};

const onChangeInput = (event) => {
  filters.filterInput = event.target.value;
};

onMounted(async () => {
  await productStore.fetchItems();
  productStore.fetchFavorites();
  productStore.loadCartFromLocalStorage();
});
</script>

<template>
  <div class="flex flex-col gap-4 ml-10 filters-container">
    <select
        @change="onChangeSelect"
        class="bg-black text-gray-400  py-2 px-3.5 border rounded-md outline-none select-sort "
    >
      <option value="name" class="select-option">By name</option>
      <option value="price" class="select-option">By price(low to high)</option>
      <option value="-price" class="select-option">By price(high to low)</option>
    </select>

    <div class="relative">
      <img
          src="/search.png"
          alt="Search"
          class="absolute w-5 left-3 top-2.5 fill-slate-600"
      />
      <input
          @input="onChangeInput"
          class="bg-black border rounded-md py-2 pl-11 pr-4 outline-none search-input text-white"
          type="text"
          placeholder="Search..."
      />
    </div>
  </div>

  <CardList :items="filteredProducts"/>
</template>

<style scoped>
/* Стандартные стили для больших экранов */
.filters-container {
  display: flex;
  gap: 16px;
}

.select-sort {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  width: 100%;
}

.search-container {
  position: relative;
}

.search-input {
  background-color: #111;
  border: 1px solid #444;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  width: 100%;
}

/* Медиазапрос для мобильных экранов */
@media (max-width: 550px) and (min-width: 320px) {

  .filters-container {
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin: 0;
  }

  .filters-container > div {
    width: 100%;
  }


  .search-input {
    width: 100%;
    padding-left: 3rem;
    font-size: 0.9rem;
  }

  .search-container img {
    width: 18px;
    left: 10px;
  }

  .select-sort {
    width: 100%;
  }
}

@media (max-width: 768px) and (min-width: 550px) {

  .filters-container {
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin: 0;
  }

  .filters-container > div {
    width: 100%;
  }

  .select-sort,
  .search-input {
    width: 100%;
    padding-left: 3rem;
    font-size: 0.9rem;
    margin-left: 0;
    margin-right: 0;
  }

  .search-container img {
    width: 18px;
    left: 10px;
  }

  .select-sort {
    width: 100%;
  }
}
@media (max-width: 1024px) and (min-width: 768px) {

  .select-sort,
  .search-input {
    width: 100%;
    padding-left: 3rem;
    font-size: 0.9rem;
    margin-left: 0;
    margin-right: 0;
  }
}
@media (max-width: 1280px) and (min-width: 1024px) {
  .select-sort,
  .search-input {
    width: 100%;
    padding-left: 3rem;
    font-size: 0.9rem;
    margin-left: 0;
    margin-right: 0;
  }
}
@media (min-width: 1280px) {
  .filters-container {
    display: flex;
    flex-direction: row;
  }
  .select-sort,
  .search-input {
    width: 250px;
    padding-left: 3rem;
    font-size: 0.9rem;
    margin-left: 0;
    margin-right: 0;
  }
}
</style>