<script setup>
import {createdCartStore} from "../store.js";
import CartItem from "./CartItem.vue";
import {inject} from "vue";

const { cart, removeItemFromCart } = inject('cart')

const cartStore = createdCartStore()
</script>

<template>
  <div class="flex flex-col flex-1 gap-4" v-auto-animate>
    <CartItem v-for="item in cartStore.getAllItemsInCart"
              :item="item"
              :key="item.product.id"
              :title="item.product.title"
              :price="item.product.price"
              :image-url="item.product.imageUrl"
              :quantity="item.quantity"
              @removeItemFromCart="() => cartStore.removeItemFromCart"
    />
  </div>

</template>