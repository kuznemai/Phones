<script setup>
import Card from "./Card.vue";
import {createdCartStore} from "../store.js";

defineProps({
  // items: Array,
  addItemToCart: Function,
  removeItemFromCart: Function,
  onClickFavorite: Function,
  cart: Array,
  isFavorites: Boolean
});

const cartStore2 = createdCartStore()

// const items = computed(() => cartStore.getAllProducts);

const emit = defineEmits(['addToFavorite'])

</script>

<template>
  <div class="grid grid-cols-4 gap-5 p-10">
    <Card
        v-for="item in cartStore2.getAllProducts"
        :key="item.id"
        :item="item"
        :is-favorite="item.isFavorite"
        :onClickFavorite="isFavorites ? null : () => emit('addToFavorite', item)"
        :addItemToCart="addItemToCart"
        :removeItemFromCart="removeItemFromCart"
        :cart="cart"
    />
  </div>
</template>
