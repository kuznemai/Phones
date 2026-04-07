<script setup lang="ts">
import { onMounted, computed } from "vue";
import CardList from "../components/CardList.vue";
import { useProductStore } from "../store";

const productStore = useProductStore();

const favoritesList = computed(() => productStore.favorites);

onMounted(() => {
  productStore.fetchFavorites();
});
</script>

<template>
  <div class="fade-in px-4 pb-12 pt-8 text-white sm:px-6 md:px-10 md:pb-16 md:pt-10">
    <h1 class="mb-2 text-2xl font-light text-white md:text-3xl">Favorites</h1>
    <p class="mb-8 max-w-xl text-sm text-zinc-500 md:text-base">Devices you saved for later.</p>
    <CardList :items="favoritesList" />
  </div>
</template>
