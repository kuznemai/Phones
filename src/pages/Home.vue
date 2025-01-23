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
  let products = productStore.products;

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
  return products; // Не забудьте вернуть отфильтрованные и отсортированные продукты
});

const onChangeSelect = (event) => {
  filters.sortBy = event.target.value;
  productStore.fetchItems(filters)
};

const onChangeInput = (event) => {
  filters.filterInput = event.target.value;
  productStore.fetchItems(filters)
};


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
    :items="filteredProducts"
    :add-item-to-cart="productStore.addProductToCart"
    @add-to-favorite="productStore.addToFavorite"
  />
<!-- TODO:add-item-to-cart="productStore.addProductToCart"  поглядеть в чем дело-->
</template>


<!--<script setup>-->
<!--import CardList from "../components/CardList.vue";-->
<!--import { onMounted, reactive, watch } from "vue";-->
<!--import { useProductStore } from "../store.js";-->

<!--const productStore = useProductStore();-->

<!--const filters = reactive({-->
<!--  sortBy: "title",-->
<!--  filterInput: "",-->
<!--});-->

<!--// Функция для фильтрации продуктов-->
<!--const filteredProducts = computed(() => {-->
<!--  let products = productStore.products;-->

<!--  // Фильтрация по названию-->
<!--  if (filters.filterInput) {-->
<!--    products = products.filter(product =>-->
<!--        product.title.toLowerCase().includes(filters.filterInput.toLowerCase())-->
<!--    );-->
<!--  }-->

<!--  // Сортировка-->
<!--  if (filters.sortBy) {-->
<!--    products = products.sort((a, b) => {-->
<!--      if (filters.sortBy === "price") {-->
<!--        return a.price - b.price;-->
<!--      } else if (filters.sortBy === "-price") {-->
<!--        return b.price - a.price;-->
<!--      } else {-->
<!--        return a.title.localeCompare(b.title);-->
<!--      }-->
<!--    });-->
<!--  }-->

<!--  return products;-->
<!--});-->

<!--const onChangeSelect = (event) => {-->
<!--  filters.sortBy = event.target.value;-->
<!--};-->

<!--const onChangeInput = (event) => {-->
<!--  filters.filterInput = event.target.value;-->
<!--};-->

<!--// Вызываем fetchItems при монтировании-->
<!--onMounted(async () => {-->
<!--  await productStore.fetchItems(filters);-->
<!--  productStore.fetchFavorites();-->
<!--});-->
<!--</script>-->

<!--<template>-->
<!--  <div class="flex gap-4">-->
<!--    <select-->
<!--        @change="onChangeSelect"-->
<!--        class="py-2 px-3 border rounded-md outline-none"-->
<!--    >-->
<!--      <option value="title">By name</option>-->
<!--      <option value="price">By price(low to high)</option>-->
<!--      <option value="-price">By price(high to low)</option>-->
<!--    </select>-->

<!--    <div class="relative">-->
<!--      <img-->
<!--          src="/search.png"-->
<!--          alt="Search"-->
<!--          class="absolute w-5 left-3 top-2.5 fill-slate-600"-->
<!--      />-->
<!--      <input-->
<!--          @input="onChangeInput"-->
<!--          class="border rounded-md py-1.5 pl-11 pr-4 outline-none"-->
<!--          type="text"-->
<!--          placeholder="Search..."-->
<!--      />-->
<!--    </div>-->
<!--  </div>-->
<!--  <CardList-->
<!--      :items="filteredProducts" &lt;!&ndash; Используем отфильтрованные продукты &ndash;&gt;-->
<!--  :add-item-to-cart="productStore.addProductToCart"-->
<!--  @add-to-favorite="productStore.addToFavorite"-->
<!--  />-->
<!--</template>-->