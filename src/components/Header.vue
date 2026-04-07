<script setup lang="ts">
import Cart from "./Cart.vue";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../authStore";

const isMobileMenuOpen = ref(false);
const auth = useAuthStore();
auth.hydrate();
const { isAuthenticated } = storeToRefs(auth);

const closeMenu = (): void => {
  isMobileMenuOpen.value = false;
};

const logout = (): void => {
  auth.logout();
  closeMenu();
};
</script>

<template>
  <header class="header-nav flex justify-between border-b border-slate-400 px-10 py-2 relative z-1">
    <router-link to="/">
      <div class="flex items-center gap-4">
        <img class="h-12" src="/logo.svg" alt="IZ Operating System" />
      </div>
    </router-link>

    <!-- Навигация для десктопа -->
    <nav class="flex items-center justify-between w-full max-w-6xl mx-auto hidden md:flex">

      <div class="desktop-nav flex gap-6 flex-grow justify-center">
        <router-link to="/" class="text-gray-400 hover:text-slate-200 text-base md:text-sm lg:text-base">HOME</router-link>
        <router-link to="/shop" class="text-gray-400 hover:text-slate-200 text-base md:text-sm lg:text-base">SHOP</router-link>
        <router-link to="/contact" class="text-gray-400 hover:text-slate-200 text-base md:text-sm lg:text-base">CONTACT US</router-link>
        <router-link to="/offer" class="text-gray-400 hover:text-slate-200 text-base md:text-sm lg:text-base">OUR OFFER</router-link>
      </div>

      <div class="nav-sidebar flex gap-6">
        <router-link to="/cart" class="text-gray-500 hover:text-slate-200 transition flex items-center">
          <Cart />
        </router-link>
        <router-link to="/favorites" class="text-gray-400 hover:text-slate-200 flex items-center gap-2">
          <img src="/heart.svg" alt="Like" class="w-5 h-5" />
          <span class="text-base md:text-sm lg:text-base">Favorites</span>
        </router-link>
        <router-link
          v-if="isAuthenticated"
          to="/profile"
          class="text-gray-400 hover:text-slate-200 flex items-center gap-2 text-base"
        >
          <img src="/profile.svg" alt="" class="w-5 h-5" />
          <span class="md:text-sm lg:text-base">Profile</span>
        </router-link>
        <router-link
          v-else
          to="/login"
          class="text-gray-400 hover:text-slate-200 flex items-center gap-2 text-base md:text-sm lg:text-base"
        >
          <img src="/profile.svg" alt="" class="w-5 h-5 opacity-90" />
          <span>Sign in</span>
        </router-link>
        <button
          v-if="isAuthenticated"
          type="button"
          class="flex shrink-0 items-center gap-2 text-gray-400 hover:text-slate-200"
          @click="logout"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
            />
          </svg>
          <span class="text-base md:text-sm lg:text-base">Log out</span>
        </button>
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
        <router-link to="/contact" @click="closeMenu">
          <li class="cursor-pointer hover:text-slate-200">Contact us</li>
        </router-link>
        <router-link to="/offer" @click="closeMenu">
          <li class="cursor-pointer hover:text-slate-200">Our offer</li>
        </router-link>
        <router-link to="/favorites" @click="closeMenu">
          <li class="flex items-center gap-3 cursor-pointer hover:text-slate-200">
            <img src="/heart.svg" alt="Like" class="w-6 h-6" />
            <span>Favorites</span>
          </li>
        </router-link>
        <router-link v-if="isAuthenticated" to="/profile" @click="closeMenu">
          <li class="flex items-center gap-3 cursor-pointer hover:text-slate-200">
            <img src="/profile.svg" alt="" class="w-6 h-6" />
            <span>Profile</span>
          </li>
        </router-link>
        <router-link v-else to="/login" @click="closeMenu">
          <li class="flex items-center gap-3 cursor-pointer hover:text-slate-200">
            <img src="/profile.svg" alt="" class="w-6 h-6 opacity-90" />
            <span>Sign in</span>
          </li>
        </router-link>
        <li v-if="isAuthenticated">
          <button
            type="button"
            class="flex cursor-pointer items-center gap-3 text-left text-lg hover:text-slate-200"
            @click="logout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
            <span>Log out</span>
          </button>
        </li>
        <router-link
          to="/cart"
          @click="closeMenu"
          class="flex items-center gap-3 cursor-pointer hover:text-slate-200"
        >
          <Cart />
        </router-link>
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
