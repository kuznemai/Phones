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
  <header class="header-nav relative z-[100] w-full border-b border-slate-400 bg-black">
    <!-- Full viewport width; inner row uses horizontal padding only -->
    <div
      class="flex w-full items-center justify-between gap-2 px-4 py-2 sm:gap-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16"
    >
      <router-link to="/" class="shrink-0">
        <div class="flex items-center gap-4">
          <img class="h-9 w-auto sm:h-10 md:h-12" src="/logo.svg" alt="IZ Operating System" />
        </div>
      </router-link>

      <nav class="mx-4 hidden min-w-0 flex-1 items-center justify-between lg:flex">
        <div class="desktop-nav flex min-w-0 flex-grow justify-center gap-3 xl:gap-5 2xl:gap-7">
          <router-link
            to="/"
            class="shrink-0 whitespace-nowrap text-sm text-gray-400 hover:text-slate-200 xl:text-base"
            >HOME</router-link
          >
          <router-link
            to="/shop"
            class="shrink-0 whitespace-nowrap text-sm text-gray-400 hover:text-slate-200 xl:text-base"
            >SHOP</router-link
          >
          <router-link
            to="/contact"
            class="shrink-0 whitespace-nowrap text-sm text-gray-400 hover:text-slate-200 xl:text-base"
            >CONTACT US</router-link
          >
          <router-link
            to="/offer"
            class="shrink-0 whitespace-nowrap text-sm text-gray-400 hover:text-slate-200 xl:text-base"
            >OUR OFFER</router-link
          >
        </div>

        <div
          class="nav-sidebar flex shrink-0 flex-wrap items-center justify-end gap-2 md:gap-3 xl:gap-5"
        >
          <router-link to="/cart" class="flex shrink-0 items-center text-gray-500 transition hover:text-slate-200">
            <Cart />
          </router-link>
          <router-link
            to="/favorites"
            class="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-gray-400 hover:text-slate-200 xl:gap-2"
          >
            <img src="/heart.svg" alt="" class="h-5 w-5" />
            <span class="text-sm xl:text-base">Favorites</span>
          </router-link>
          <router-link
            v-if="isAuthenticated"
            to="/profile"
            class="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-gray-400 hover:text-slate-200 xl:gap-2"
          >
            <img src="/profile.svg" alt="" class="h-5 w-5" />
            <span class="text-sm xl:text-base">Profile</span>
          </router-link>
          <router-link
            v-else
            to="/login"
            class="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-gray-400 hover:text-slate-200 xl:gap-2"
          >
            <img src="/profile.svg" alt="" class="h-5 w-5 opacity-90" />
            <span class="text-sm xl:text-base">Sign in</span>
          </router-link>
          <button
            v-if="isAuthenticated"
            type="button"
            class="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-gray-400 hover:text-slate-200 xl:gap-2"
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
            <span class="text-sm xl:text-base">Log out</span>
          </button>
        </div>
      </nav>

      <div class="flex shrink-0 items-center lg:hidden" @click="isMobileMenuOpen = !isMobileMenuOpen">
        <img src="/burger-icon.svg" alt="" class="h-8 w-8 cursor-pointer" role="presentation" />
      </div>
    </div>

    <!-- Full-screen opaque overlay (fixed to viewport, not the narrow app column) -->
    <div
      v-if="isMobileMenuOpen"
      class="burger_opened fixed inset-0 z-[250] flex flex-col bg-black lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <div class="flex items-center justify-between border-b border-zinc-800 px-4 py-3 sm:px-6">
        <router-link to="/" class="flex items-center gap-3" @click="closeMenu">
          <img class="h-9 w-auto" src="/logo.svg" alt="IZ Operating System" />
        </router-link>
        <button
          type="button"
          class="flex h-11 w-11 items-center justify-center text-3xl text-white hover:text-zinc-300"
          aria-label="Close menu"
          @click="closeMenu"
        >
          &times;
        </button>
      </div>

      <ul class="flex flex-col gap-5 overflow-y-auto px-6 pb-10 pt-8 text-lg text-white">
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
          <li class="flex cursor-pointer items-center gap-3 hover:text-slate-200">
            <img src="/heart.svg" alt="" class="h-6 w-6" />
            <span>Favorites</span>
          </li>
        </router-link>
        <router-link v-if="isAuthenticated" to="/profile" @click="closeMenu">
          <li class="flex cursor-pointer items-center gap-3 hover:text-slate-200">
            <img src="/profile.svg" alt="" class="h-6 w-6" />
            <span>Profile</span>
          </li>
        </router-link>
        <router-link v-else to="/login" @click="closeMenu">
          <li class="flex cursor-pointer items-center gap-3 hover:text-slate-200">
            <img src="/profile.svg" alt="" class="h-6 w-6 opacity-90" />
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
        <router-link to="/cart" @click="closeMenu" class="flex cursor-pointer items-center gap-3 hover:text-slate-200">
          <Cart />
        </router-link>
      </ul>
    </div>
  </header>
</template>

<style scoped>
.header-nav {
  font-family: "Roboto Thin", sans-serif;
}
</style>
