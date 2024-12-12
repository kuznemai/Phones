<script setup>
import Buttons from "./Buttons.vue";
import { useProductStore } from "../store.js";

const cartStore = useProductStore();

const emit = defineEmits(["removeItemFromCart"]);

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
  <div
    class="flex items-center border border-slate-100 p-5 rounded-xl gap-10 mt-2"
  >
    <img class="w-16 h-22" :src="imageUrl" :alt="title" />

    <div class="flex flex-col flex-1">
      <p>{{ title }}</p>

      <div class="flex gap-2 items-center mt-4">
        <div class="flex justify-between mt-2">
          <b class="flex-1">{{ price }} $</b>
        </div>

        <div
          class="flex items-center space-x-2 border-solid border-2 border-gray-200 rounded-lg"
        >
          <Buttons :id="item.id" />
        </div>

        <div>
          <img
            @click="cartStore.deleteProductFromCart(item.id, item.quantity)"
            src="/close.svg"
            alt="Delete"
            class="cursor-pointer opacity-60 hover:opacity-100 transition ml-50"
          />
        </div>
      </div>
    </div>
  </div>
</template>
