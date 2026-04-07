<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

const route = useRoute();
const showHeader = computed(() => route.name !== "Login");
</script>

<template>
  <div class="min-h-screen min-w-0 bg-black">
    <Header v-if="showHeader" />
    <div
      class="app-shell mx-auto mb-6 mt-4 min-w-0 w-full max-w-[1600px] rounded-xl bg-black px-3 shadow-xl sm:mb-8 sm:mt-6 sm:px-4 md:mb-12 md:mt-10 md:px-5 lg:mb-14 lg:mt-14 lg:px-7 xl:px-9"
    >
      <router-view></router-view>
    </div>
    <Footer />
  </div>
</template>

<style>
* {
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
