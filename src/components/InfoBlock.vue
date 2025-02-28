<script setup>
defineProps({
  title: String,
  description: String,
  imageUrl: String,
});
</script>

<template>
  <div class="mt-40 flex flex-col items-center text-center gap-4 w-72 mx-auto">
    <img height="80" width="80" :src="imageUrl" alt="Info image" />
    <h2 class="mt-4 text-white text-2xl font-medium">{{ title }}</h2>
    <p class="text-gray-400">{{ description }}</p>
  </div>
</template>
