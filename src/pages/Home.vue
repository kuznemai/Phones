<script setup>
import CardList from "../components/CardList.vue";
import axios from "axios";
import {computed, onBeforeMount, onMounted, reactive, ref, watch} from "vue";
import { useProductStore } from "../store.js";

const productStore = useProductStore();

const filters = reactive({
  sortBy: "title",
  filterInput: "",
});

const filteredProducts = computed(() => {
  let products = [...productStore?.products] ;

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
  <div class="flex gap-4 ml-10">
    <select
        @change="onChangeSelect"
        class="bg-black text-gray-400  py-2 px-3.5 border rounded-md outline-none "
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
          class="bg-black border rounded-md py-2 pl-11 pr-4 outline-none"
          type="text"
          placeholder="Search..."
      />
    </div>
  </div>
  <CardList
      :items="filteredProducts"
  />
  <!-- TODO:add-item-to-cart="productStore.addProductToCart"  поглядеть в чем дело-->
</template>