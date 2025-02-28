<script setup>
import Header from "./components/Header.vue";
import Drawer from "./components/Drawer.vue";
import { ref, provide, computed } from "vue";
// import {createdCartStore} from "./store.js";
import { useProductStore } from "./store.js";
import Home from "./pages/Home.vue";
import CardOfItem from "./components/CardOfItem.vue";

const productStore = useProductStore();

// const cartStore = createdCartStore()

const drawerOpen = ref(false);

const closeDrawer = () => {
  drawerOpen.value = false;
};

const openDrawer = () => {
  console.log("openDrawer");
  drawerOpen.value = true;
};

provide("cart", {
  closeDrawer,
  openDrawer,
});

</script>

<template>
  <div class="bg-black w-4/5 m-auto rounded-xl shadow-xl mt-14">
    <Header @openDrawer="openDrawer" />

    <Drawer v-if="drawerOpen" :totalPrice="productStore.getTheTotalPrice()" />


    <div class="flex justify-end items-center mt-5 mr-5"></div>
    <router-view></router-view>

  </div>
</template>

<style>
*{
  font-family: "Roboto Thin", sans-serif;
}
.fade-in {
  opacity: 0;
  animation: fadeIn 1.5s ease-in-out forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>