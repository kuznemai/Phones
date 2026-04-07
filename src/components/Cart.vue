<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useProductStore } from "../store";

const cartStore = useProductStore();

// Загружаем корзину из localStorage при загрузке компонента
onMounted(() => {
  cartStore.loadCartFromLocalStorage();
});

// Создаем реактивное вычисляемое свойство
const totalPrice = computed(() => cartStore.getTheTotalPrice());
</script>

<template>
  <div class="flex items-center gap-3 cursor-pointer text-inherit">
    <img src="/cart.svg" alt="Cart" class="opacity-80" />
    <span class="cart-icon w-[50px] text-base lg:text-base">{{ totalPrice }}$</span>
  </div>
</template>

<style scoped>
@media (max-width: 1024px) and (min-width: 768px) {
  .cart-icon {
    width: 30px;
    font-size: 14px;
  }
}
</style>