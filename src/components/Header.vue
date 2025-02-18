<script setup>
import Cart from "./Cart.vue";
import { defineEmits } from "vue";

const emit = defineEmits(["openDrawer"]);
</script>

<template>
  <header class="flex justify-between border-b border-slate-400 px-10 py-2">
    <router-link to="/home">
      <div class="flex items-center gap-4">
        <img class="w-20" src="/logo.png" alt="logo" />
        <div>
          <h2 class="text-xl font-bold uppercase">Shop</h2>
          <p class="text-slate-500"></p>
        </div>
      </div>
    </router-link>

    <ul class="flex items-center gap-8">
      <Cart @click="() => emit('openDrawer')" />
      <router-link to="/favorites">
        <li
            class="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-slate-200 transition"
        >
          <img src="/heart.svg" alt="Like" />
          <span>Favorites</span>
        </li>
      </router-link>
      <li
          class="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-slate-200 transition"
      >
        <img src="/profile.svg" alt="Profile" />
        <span>Profile</span>
      </li>
    </ul>
  </header>
</template>

<style scoped></style>