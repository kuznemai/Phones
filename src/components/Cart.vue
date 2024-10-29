
<script setup>
import {computed} from "vue";
import {createdCartStore} from "../store.js";

const cartStore = createdCartStore()

const props = defineProps({
  cart: Array
});

// const totalPrice = computed((item) => {
//   return props.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
// })
</script>

<template>
  <li class="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-black transition">
    <img src="/cart.svg" alt="Cart"/>
    <span>{{ cartStore.getTotalValue }} $</span>
  </li>
</template>

<style scoped>

</style>