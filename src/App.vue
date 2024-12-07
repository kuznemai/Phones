<script setup>
import Header from "./components/Header.vue";
import Drawer from "./components/Drawer.vue";
import { ref, provide, computed } from "vue";
// import {createdCartStore} from "./store.js";
import { useProductStore } from "./store2.js";

const productStore = useProductStore();

// const cartStore = createdCartStore()

const drawerOpen = ref(false);

const closeDrawer = () => {
  drawerOpen.value = false;
};

const openDrawer = () => {
  drawerOpen.value = true;
};

// data.forEach(product => {
//   cartStore.addProduct(product)
// })

// const addItemToCart = (item) => {
//   cartStore.addItem(item)
//     cart.value.push(item);
//     console.log('dddddqwrqw',cart.value)
// };
// const removeItemFromCart = (item) => {
//   cart.value.splice(cart.value.indexOf(item), 1);
// };
// const totalPrice = computed(() => {
//   return cart.value.reduce((acc, item) => acc + item.price * item.quantity, 0);
// });

provide("cart", {
  closeDrawer,
  openDrawer,
});
</script>

<template>
  <div class="bg-white w-4/5 m-auto rounded-xl shadow-xl mt-14">
    <!--    :cart="cart"-->
    <Drawer v-if="drawerOpen" :totalPrice="productStore.getTheTotalPrice" />
    <!--    :cart="cart"-->
    <Header @openDrawer="openDrawer" />

    <div class="flex justify-end items-center mt-5 mr-5"></div>
    <!--    <Home />-->
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
