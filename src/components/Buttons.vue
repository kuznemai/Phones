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
    @click="cartStore.deleteProductFromCart(id, 1)"
    class="minus bg-gray-200 hover:bg-gray-300 transition text-gray-800 px-3 py-1"
  >
    -
  </button>

  <!--  <span class="counter text-lg">{{ cartStore.getCount(id) }}</span>-->
  <span class="counter text-lg">{{ cartStore.getCount(id) }}</span>

  <!--  <button type="button" @click="cartStore.addItemToCart(id, 1)"-->
  <button
    type="button"
    @click="cartStore.addProductToCart(id)"
    class="plus bg-gray-200 hover:bg-gray-300 transition text-gray-800 px-3 py-1"
  >
    +
  </button>
</template>
