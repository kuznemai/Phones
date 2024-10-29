<script setup>
import Buttons from "./Buttons.vue";
import {createdCartStore} from "../store.js";

const cartStore = createdCartStore()

const emit = defineEmits(['removeItemFromCart']);

const props = defineProps({
  item: Object,
  id: Number,
  imageUrl: String,
  title: String,
  price: Number,
  quantity: Number,
  counter: Number,

});
</script>

<template>
  <div class="flex items-center border border-slate-100 p-5 rounded-xl gap-10 mt-2">
    <img class="w-16 h-22" :src="imageUrl" :alt="title"/>

    <div class="flex flex-col flex-1">
      <p>{{ title }}</p>

      <div class="flex gap-2 items-center mt-4">

        <div class="flex justify-between mt-2">
          <b class="flex-1">{{ price }} $</b>
        </div>

        <div class="flex items-center space-x-2 border-solid border-2 border-gray-200 rounded-lg ">
          <Buttons :id="item.product.id"/>
<!--          <button type="button" class="minus bg-gray-200 hover:bg-gray-300 transition text-gray-800 px-2 py-1">- -->
<!--          </button>-->
<!--          <span class="counter text-lg">{{ quantity }}</span>-->
<!--          <button type="button" class="plus bg-gray-200 hover:bg-gray-300 transition text-gray-800 px-2 py-1">+</button>-->
        </div>

        <div>
          <img
              @click="cartStore.addItemToCart(item.product.id, -cartStore.getCount(item.product.id))"
              src="/close.svg"
              alt="Delete"
              class="cursor-pointer opacity-60 hover:opacity-100 transition ml-50"/>
        </div>

      </div>
    </div>

  </div>
</template>