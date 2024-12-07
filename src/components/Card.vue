<script setup>
import { defineProps } from "vue";

import Buttons from "./Buttons.vue";
// import {createdCartStore} from "../store.js";
import { useProductStore } from "../store2.js";

const props = defineProps({
  item: Object,
  isFavorite: Boolean,
  onClickFavorite: Function,
});
console.log(props.item);

// Состояния
// const inCart = ref(false);
// const counter = ref(0);
//

// const pressBuy = () => {
//   inCart.value = true;
//   // addItem(props.item);
// };

// const cartStore = createdCartStore()

const productStore = useProductStore();

// Добавление товара в корзину
// const addItem = (item) => {
//   const existingItem = props.cart.find(product => product.id === item.id);
//   if (existingItem) {
//     existingItem.quantity++;
//   } else {
//     item.quantity = 1;
//     props.addItemToCart(item);
//   }
//   counter.value++;
// };
//
// // Удаление товара
// const removeItem = (item) => {
//   if (counter.value > 0) {
//     const existingItem = props.cart.find(product => product.id === item.id);
//     if (existingItem) {
//       existingItem.quantity--;
//       if (existingItem.quantity <= 0) {
//         props.removeItemFromCart(existingItem);
//       }
//     }
//     counter.value--;
//     if (counter.value === 0) {
//       inCart.value = false;
//     }
//   }
// };
</script>

<template>
  <div
    class="flex flex-col justify-between relative bg-white border border-slate-100 rounded-3xl p-4 cursor-pointer hover:-translate-y-2 hover:shadow-xl transition"
  >
    <img
      v-if="onClickFavorite"
      :src="!isFavorite ? '/like-1.svg' : '/like-2.svg'"
      class="absolute top-4 left-4"
      alt="Like"
      @click="onClickFavorite"
    />

    <img :src="item.imageUrl" class="w-20 mx-auto my-5 py-2" alt="Product" />
    <p class="mt-2">{{ item.title }}</p>

    <div class="flex flex-row justify-between">
      <div class="flex flex-col mt-2">
        <span class="text-slate-400">Price:</span>
        <b class="price">{{ item.price }} $</b>
      </div>

      <div>
        <div v-if="productStore.getCount(item.id) > 0">
          <div
            class="flex items-center space-x-3 border-solid border-2 border-gray-200 rounded-lg mr-8"
          >
            <Buttons :id="item.id" />
            <!--            <button type="button" @click="removeItem(props.item)" class="minus bg-gray-200 hover:bg-gray-300 transition text-gray-800 px-3 py-1">-</button>-->
            <!--            <span class="counter text-lg">{{ counter }}</span>-->
            <!--            <button type="button" @click="addItem(props.item)" class="plus bg-gray-200 hover:bg-gray-300 transition text-gray-800 px-3 py-1">+</button>-->
          </div>
        </div>
        <button
          v-else
          type="button"
          @click="productStore.addProductToCart(item.id, 1)"
          class="button_addtocart"
        >
          Buy
        </button>
      </div>
    </div>
  </div>
</template>
