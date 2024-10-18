<script setup>
import Card from "./Card.vue";

defineProps({
  items: Array
})

const emit = defineEmits(['addToCart'], ['remove-from-cart'])
</script>

<template>
  <div class="grid grid-cols-4 gap-5 p-10">
    <Card
        v-for="item in items"
        :key="item.id"
        :title="item.title"
        :imageUrl="item.imageUrl"
        :price="item.price"
        :is-added="true"
        :onClickAdd="() => emit('addToCart', item)"
        :onClickRemove="() => emit('remove-from-cart', item)"
    />
  </div>
</template>
