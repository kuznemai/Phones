<script setup>
import { inject } from "vue";

const { closeDrawer } = inject("cart");
</script>

<template>
  <div class="flex items-center gap-5">
    <svg
        @click="closeDrawer"
        class="opacity-30 cursor-pointer rotate-180 hover:opacity-100 transition hover:-translate-x-1"
        width="26"
        height="24"
        viewBox="0 0 16 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
      <path
          d="M1 7H14.7143"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
      />

      <path
          d="M8.71436 1L14.7144 7L8.71436 13"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
      />
    </svg>
    <h2 class="text-2xl font-bold text-white">Cart</h2>
  </div>
</template>