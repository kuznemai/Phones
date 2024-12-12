<script setup>
import CardList from "../components/CardList.vue";
import axios from "axios";
import { onBeforeMount, onMounted, reactive, ref, watch } from "vue";
import { useProductStore } from "../store.js";

const productStore = useProductStore();

const filters = reactive({
  sortBy: "title",
  filterInput: "",
});

const onChangeSelect = (event) => {
  filters.sortBy = event.target.value;
};

const onChangeInput = (event) => {
  filters.filterInput = event.target.value;
};

const fetchItems = async () => {
  await productStore.fetchItems(filters);
};

watch(filters, fetchItems);

onMounted(async () => {
  await productStore.fetchItems(filters);
  productStore.fetchFavorites();
});
</script>

<template>
  <div class="flex gap-4">
    <select
      @change="onChangeSelect"
      class="py-2 px-3 border rounded-md outline-none"
    >
      <option value="name">By name</option>
      <option value="price">By price(low to high)</option>
      <option value="-price">By price(high to low)</option>
    </select>

    <div class="relative">
      <img
        src="/search.png"
        alt="Search"
        class="absolute w-5 left-3 top-2.5 fill-slate-600"
      />
      <input
        @input="onChangeInput"
        class="border rounded-md py-1.5 pl-11 pr-4 outline-none"
        type="text"
        placeholder="Search..."
      />
    </div>
  </div>
  <CardList
    :items="productStore.products"
    :add-item-to-cart="productStore.addProductToCart"
    @add-to-favorite="productStore.addToFavorite"
  />
</template>
