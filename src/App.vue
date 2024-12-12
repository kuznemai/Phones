<script setup>
import Header from "./components/Header.vue";
import Drawer from "./components/Drawer.vue";
import { ref, provide, computed } from "vue";
// import {createdCartStore} from "./store.js";
import { useProductStore } from "./store.js";

const productStore = useProductStore();

// const cartStore = createdCartStore()

const drawerOpen = ref(false);

const closeDrawer = () => {
  drawerOpen.value = false;
};

const openDrawer = () => {
  drawerOpen.value = true;
};

provide("cart", {
  closeDrawer,
  openDrawer,
});
</script>

<template>
  <div class="bg-white w-4/5 m-auto rounded-xl shadow-xl mt-14">
    <Drawer v-if="drawerOpen" :totalPrice="productStore.getTheTotalPrice" />

    <Header @openDrawer="openDrawer" />

    <div class="flex justify-end items-center mt-5 mr-5"></div>
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
