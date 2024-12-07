<script setup>
import Card from "./Card.vue";
// import {createdCartStore} from "../store.js";
import { useProductStore } from "../store2.js";
// removeItemFromCart: Function,
// addItemToCart: Function,
defineProps({
  items: Array,

  onClickFavorite: Function,
  // cart: Array,
});

// const cartStore2 = createdCartStore()

const productStore = useProductStore();

// const items = computed(() => cartStore.getAllProducts);
const emit = defineEmits(["addToFavorite"]);

const addToFavorite = (item) => {
  emit("addToFavorite", item);
};
</script>

<template>
  <div class="grid grid-cols-4 gap-5 p-10">
    <!--    :cart="cart"-->
    <!--    :removeItemFromCart="removeItemFromCart"-->
    <Card
      v-for="item in productStore.getAllProducts"
      :key="item.id"
      :item="item"
      :is-favorite="item.isFavorite"
      @add-to-favorite="addToFavorite"
    />
  </div>
</template>
