<script setup>
import { computed, onMounted } from "vue";
import { useProductStore } from "../store.js";

const cartStore = useProductStore();

// Загружаем корзину из localStorage при загрузке компонента
onMounted(() => {
  cartStore.loadCartFromLocalStorage();
});

// Создаем реактивное вычисляемое свойство
const totalPrice = computed(() => cartStore.getTheTotalPrice());
</script>

<template>
  <li class="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-slate-200 transition">
    <img src="/cart.svg" alt="Cart" />
    <span class="cart-icon w-[50px] text-base lg:text-base">{{ totalPrice }}$</span>
  </li>
</template>

<style scoped>
@media (max-width: 1024px) and (min-width: 768px) {
  .cart-icon {
    width: 30px;
    font-size: 14px;
  }
}
</style>