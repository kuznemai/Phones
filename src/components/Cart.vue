
<script setup>
import {createdCartStore} from "../store.js";

const cartStore = createdCartStore()
</script>

<template>
  <li class="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-black transition">
    <img src="/cart.svg" alt="Cart"/>
    <span>{{ cartStore.getTotalValue }} $</span>
  </li>
</template>

<style scoped>

</style>