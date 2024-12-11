<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import CardList from "../components/CardList.vue";

let favorites = ref([]);

onMounted(async () => {
  try {
    const { data } = await axios.get(
      "https://ad59c37a99f145f4.mokky.dev/favorites?_relations=items",
    );
    console.log("data", data);
    favorites.value = data.map((obj) => obj.item);
    console.log("favorites", favorites);
  } catch (err) {
    console.log(err);
  }
});
</script>

<template>
  <h1>Favorites</h1>
  <CardList :items="favorites" />
</template>
