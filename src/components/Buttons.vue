<script setup>
import {ref, defineProps} from 'vue';
import {createdCartStore} from "../store.js";
import { computed } from 'vue';

const cartStore = createdCartStore()
const counter = ref(0);
const inCart = ref(false);

const props = defineProps({
  item: Object,
  id: Number,
  price: Number,
  cart: Array
});

// Состояния


cartStore.getCount = function (id) {
  const inCart = computed(() => {
    return cartStore.getCount (props.item.id) > 0;
  });
};





const addItem = () => {
  const existingItem = cartStore.cart.find(product => product.id === props.id);

  if (existingItem) {
    cartStore.modifyAmount(props.id, 1); // Увеличиваем количество
  } else {
    cartStore.addItemToCart({...props.item, quantity: 1}); // Добавляем новый товар с количеством 1
  }

  inCart.value = true; // Устанавливаем флаг, что товар в корзине
};

// Добавление товара в корзину
// const addItem = () => {
//
//   if(inCart.value) {
//     cartStore.addItemToCart(this.item);
//   }
//
//   cartStore.modifyAmount(this.id, 1);
//
//   // const existingItem = cartStore.cart.find(product => product.id === item.id);
//   // if (existingItem) {
//   //   existingItem.quantity++;
//   // } else {
//   //   item.quantity = 1;
//   //   cartStore.addItemToCart(item);
//   // }
//   // counter.value++;
// };

function getItemCount() {
  const count = cartStore.getCount(props.id)

  if(count === 0) {
    inCart.value = false
  }

  return count
}


const removeItem = () => {
  const existingItem = cartStore.cart.find(product => product.id === props.id);

  if (existingItem) {
    cartStore.modifyAmount(props.id, -1); // Уменьшаем количество

    if (existingItem.quantity <= 1) {
      cartStore.removeItemFromCart(existingItem); // Удаляем товар, если количество <= 0
      inCart.value = false; // Устанавливаем флаг, что товар не в корзине
    }
  }
};
// Удаление товара
// const removeItem = () => {
//   cartStore.modifyAmount(this.id, -1);
//   //
//   // if (counter.value > 0) {
//   //   const existingItem = cartStore.cart.find(product => product.id === item.id);
//   //   if (existingItem) {
//   //     existingItem.quantity--;
//   //     if (existingItem.quantity <= 0) {
//   //       cartStore.removeItemFromCart(existingItem);
//   //     }
//   //   }
//   //   counter.value--;
//   //   if (counter.value === 0) {
//   //     inCart.value = false;
//   //   }
//   // }
// };
</script>
<template>
  <button type="button" @click="removeItem()"
          class="minus bg-gray-200 hover:bg-gray-300 transition text-gray-800 px-3 py-1">-</button>

    <span class="counter text-lg">{{ getItemCount() }}</span>

  <button type="button" @click="addItem()"
          class="plus bg-gray-200 hover:bg-gray-300 transition text-gray-800 px-3 py-1">+</button>
</template>