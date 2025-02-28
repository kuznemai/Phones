<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import CardList from "../components/CardList.vue";
import { useProductStore } from "../store.js";

const productStore = useProductStore();
</script>

<template>
  <h1>Favorites</h1>
  <div class="fav-list grid grid-cols p-10">
  <CardList :items="productStore.favorites " class="flex flex-row flex-wrap"/>
  </div>
</template>

<style scoped>
/* Медиазапрос для мобильных экранов */
@media (max-width: 550px) and (min-width: 320px) {
  .fav-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    padding: 0;
  }
}
@media (max-width: 768px) and (min-width: 550px) {
  .fav-list {
    display: flex;
    flex-direction: row;
    margin: 0;
    padding: 0;
  }
}
</style>