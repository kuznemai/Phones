<script setup>
import { defineProps } from "vue";
// import {useProductStore} from "../store.js";
//
// const cartStore = createdCartStore()

import { useProductStore } from "../store.js";

const cartStore = useProductStore();

const props = defineProps({
  id: Number,
});

</script>
<template>
  <!--  <button type="button" @click="cartStore.addItemToCart(id, -1)"-->
  <button
      type="button"
      @click="cartStore.reduceProductFromCart(id, 1)"
      class="minus transition text-gray-200 px-3 py-1"
  >
    -
  </button>

  <!--  <span class="counter text-lg">{{ cartStore.getCount(id) }}</span>-->
  <span class="counter text-lg text-white">{{ cartStore.getCount(id) }}</span>

  <!--  <button type="button" @click="cartStore.addItemToCart(id, 1)"-->
  <button
      type="button"
      @click="cartStore.addProductToCart(id)"
      class="plus   transition text-gray-200 px-3 py-1"
  >
    +
  </button>
</template>
<style scoped>

</style>