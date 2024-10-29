<script setup>
import DrawerHead from "./DrawerHead.vue";

import {inject} from "vue";
import CartItemList from "./CartItemList.vue";

const props = defineProps({
  cart: Array,
  totalPrice: Number
});


</script>

<template>
  <div class="fixed top-0 left-0 h-full w-full bg-black z-10 opacity-70 "></div>
  <div class="bg-white w-96 h-full fixed right-0 top-0 z-20 p-8">
    <DrawerHead :cart="cart"/>

    <div class="flex h-10 items-center">

    </div>


    <div>

      <CartItemList :cart="cart"/>

      <div class="flex flex-col gap-2 mt-10">
        <div class="flex gap-2">
          <span>Total:</span>
          <div class="flex-1 border-b border-dashed"></div>
          <b>{{ totalPrice }} $</b> <!-- Используем totalPrice здесь -->
        </div>

        <div class="flex gap-2">
          <span>VAT:</span>
          <div class="flex-1 border-b border-dashed"></div>
          <b>{{ (totalPrice * 0.05).toFixed(2) }} $</b> <!-- Пример расчета VAT -->
        </div>

        <button
            class="mt-4 transition bg-lime-500 w-full disabled:bg-slate-300 rounded-xl py-3 text-white hover:bg-lime-600 active:bg-lime-700 cursor:pointer">
          Place order
        </button>
      </div>
    </div>
  </div>
</template>
