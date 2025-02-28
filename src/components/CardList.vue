<script setup>
import Card from "./Card.vue";
import { useProductStore } from "../store.js";

defineProps({
  items: Array,
  onClickFavorite: Function,
});

const productStore = useProductStore();

const navigateToProduct = (id) => {
  const url = `/product/${id}`;
  window.open(url, '_blank'); // Открывает товар в новой вкладке
};
</script>

<template>
  <div v-if="items && items.length > 0" class="items_list flex flex-row flex-wrap mx-10 w-full gap-4 py-10 fade-in ">
    <Card
        v-for="item in items"
        :key="item.id"
        :item="item"
        :is-favorite="item.isFavorite"
        @add-to-favorite="productStore.addToFavorite(item)"
        @navigate-to-product="navigateToProduct(item.id)"
    />
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<style scoped>

@media (max-width: 550px) and (min-width: 320px) {
  .items_list {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
  }
}
@media (max-width: 768px) and (min-width: 550px) {
  .items_list {
    display: flex;
    flex-direction: row;
    margin: 0;
    padding-top: 40px;
  }
}
</style>
