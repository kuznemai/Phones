<script setup>
import { useProductStore } from "../store2.js";
import CartItem from "./CartItem.vue";

const cartStore = useProductStore();
</script>

<template>
  <div class="flex flex-col flex-1 gap-4" v-auto-animate>
    <CartItem
      v-for="item in cartStore.getAllItemsInCart"
      :item="item"
      :key="item.id"
      :title="item.title"
      :price="item.price"
      :image-url="item.imageUrl"
      :quantity="item.quantity"
    />
  </div>
</template>
