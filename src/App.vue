<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

const route = useRoute();
const showHeader = computed(() => route.name !== "Login");
</script>

<template>
  <div class="bg-black w-4/5 m-auto rounded-xl shadow-xl mt-14 mb-14">
    <Header v-if="showHeader" />
    <router-view></router-view>
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
