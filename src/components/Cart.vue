<script setup>
import { useProductStore } from "../store2.js";

const cartStore = useProductStore();
</script>

<template>
  <li
    class="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-black transition"
  >
    <img src="/cart.svg" alt="Cart" />
    <span>{{ cartStore.getTheTotalPrice() }} $</span>
  </li>
</template>

<style scoped></style>
