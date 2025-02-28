<script setup>
import Cart from "./Cart.vue";
import { defineEmits, ref } from "vue";

const emit = defineEmits(["openDrawer"]);
const isMobileMenuOpen = ref(false);
const props = defineProps({
  header: String
})
const closeMenu = () => {
  isMobileMenuOpen.value = false;
};
</script>

<template>
  <header class="header-nav flex justify-between border-b border-slate-400 px-10 py-2 relative z-1">
    <router-link to="/">
      <div class="flex items-center gap-4">
        <img class="w-20" src="/logo.png" alt="logo" />
      </div>
    </router-link>

    <!-- Навигация для десктопа -->
    <nav class="flex items-center justify-between w-full max-w-6xl mx-auto hidden md:flex">

      <div class="desktop-nav flex gap-6 flex-grow justify-center">
        <router-link to="/" class="text-gray-400 hover:text-slate-200 text-base md:text-sm lg:text-base">HOME</router-link>
        <router-link to="/shop" class="text-gray-400 hover:text-slate-200 text-base md:text-sm lg:text-base">SHOP</router-link>
        <router-link to="" class="text-gray-400 hover:text-slate-200 text-base md:text-sm lg:text-base">CONTACTS</router-link>
        <router-link to="" class="text-gray-400 hover:text-slate-200 text-base md:text-sm lg:text-base">OUR OFFER</router-link>
      </div>

      <div class="nav-sidebar flex gap-6">
        <button @click="emit('openDrawer')" class="hover:text-slate-200">
          <Cart />
        </button>
        <router-link to="/favorites" class="text-gray-400 hover:text-slate-200 flex items-center gap-2">
          <img src="/heart.svg" alt="Like" class="w-5 h-5" />
          <span class="text-base md:text-sm lg:text-base">Favorites</span>
        </router-link>
        <router-link to="/profile" class="text-gray-400 hover:text-slate-200 flex items-center gap-2 text-base">
          <img src="/profile.svg" alt="Profile" class="w-5 h-5 " />
          <span class="md:text-sm lg:text-base">Profile</span>
        </router-link>
      </div>
    </nav>

    <!-- Бургер-иконка (только для мобильных) -->
    <div class="md:hidden flex items-center" @click="isMobileMenuOpen = !isMobileMenuOpen">
      <img src="/burger-icon.svg" alt="burger-menu" class="w-8 h-8 cursor-pointer" />
    </div>

    <!-- Мобильное меню -->
    <div v-if="isMobileMenuOpen" class="burger_opened absolute top-0 left-0 w-full bg-gray-900 bg-opacity-90 p-6 flex flex-col gap-6 md:hidden">
      <button @click="closeMenu" class="absolute top-4 right-4 text-white text-4xl">&times;</button>

      <ul class="flex flex-col gap-6 text-white text-lg items-start pl-6">
        <router-link to="/" @click="closeMenu">
          <li class="cursor-pointer hover:text-slate-200">Home</li>
        </router-link>
        <router-link to="/shop" @click="closeMenu">
          <li class="cursor-pointer hover:text-slate-200">Shop</li>
        </router-link>
        <router-link to="/" @click="closeMenu">
          <li class="cursor-pointer hover:text-slate-200">Contact us</li>
        </router-link>
        <router-link to="/shop" @click="closeMenu">
          <li class="cursor-pointer hover:text-slate-200">Our offer</li>
        </router-link>
        <router-link to="/favorites" @click="closeMenu">
          <li class="flex items-center gap-3 cursor-pointer hover:text-slate-200">
            <img src="/heart.svg" alt="Like" class="w-6 h-6" />
            <span>Favorites</span>
          </li>
        </router-link>
        <router-link to="/profile" @click="closeMenu">
          <li class="flex items-center gap-3 cursor-pointer hover:text-slate-200">
            <img src="/profile.svg" alt="Profile" class="w-6 h-6" />
            <span>Profile</span>
          </li>
        </router-link>
        <li @click="emit('openDrawer'); closeMenu()" class="cursor-pointer hover:text-slate-200">
          <Cart />
        </li>
      </ul>
    </div>
  </header>
</template>

<style>
* {
  font-family: "Roboto Thin", sans-serif;
}
@media (max-width: 550px) and (min-width: 320px) {
  .burger_opened {
    display: flex;
    flex-direction: column;
    align-items: start;
    text-align: left;
    padding-left: 1.5rem;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.9);
    z-index: 1000;
  }
  .header-nav {
    padding-left: 0;
    padding-right: 0;
  }
}
@media (max-width: 768px) and (min-width: 550px) {
  .header-nav {
    position: relative;
    z-index: 1001;
    padding-left: 0;
    padding-right: 0;
  }

  .burger_opened {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.9);
    z-index: 1002;
    display: flex;
    flex-direction: column;
    align-items: start;
    text-align: left;
    padding-left: 1.5rem;
  }
}

@media (max-width: 1024px) and (min-width: 768px) {

  .header-nav {
    padding-left: 0;
    padding-right: 0;
  }

  .desktop-nav {
    font-size: 14px;
    gap: 14px;
  }
  .nav-sidebar {
    gap: 10px;
    font-size: 14px;
  }
}
@media (max-width: 1280px) and (min-width: 1024px) {

}
</style>
