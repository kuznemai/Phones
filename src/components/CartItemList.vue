<script setup>
import { useProductStore } from "../store.js";
import CartItem from "./CartItem.vue";

const cartStore = useProductStore();
</script>

<template>
  <div class="flex flex-col flex-1 gap-4 mt-8" v-auto-animate>
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