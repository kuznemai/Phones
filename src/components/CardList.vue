<script setup>
import Card from "./Card.vue";
import { useRoute } from "vue-router";
import { useProductStore } from "../store.js";

defineProps({
  items: Array,
  onClickFavorite: Function,
});


const route = useRoute();
const productStore = useProductStore();

</script>

<template>
  <div class="grid grid-cols-auto-fit gap-5 p-10">

    <Card
        v-for="item in items"
        :key="item.id"
        :item="item"
        :is-favorite="item.isFavorite"
        @add-to-favorite="productStore.addToFavorite(item)"
    />
  </div>
</template>