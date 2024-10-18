<script setup>
defineProps({
  totalPrice: Number
})
</script>

<template>
  <header class="flex justify-between border-b border-slate-400 px-10 py-2">
    <div class="flex items-center gap-4">
      <img class="w-40" src="/logo2.png" alt="logo"/>
      <div>
        <h2 class="text-xl font-bold uppercase">Shop</h2>
        <p class="text-slate-500">the best random shop</p>
      </div>
    </div>

    <ul class="flex items-center gap-8">
      <li class="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-black transition">
        <img src="/cart.svg" alt="Cart"/>
        <span>{{ totalPrice }} $</span>
      </li>
      <li class="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-black transition">
        <img src="/heart.svg" alt="Like"/>
        <span>Favorites</span>
      </li>
      <li class="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-black transition">
        <img src="/profile.svg" alt="Profile"/>
        <span>Profile</span>
      </li>
    </ul>
  </header>
</template>

<style scoped>

</style>
