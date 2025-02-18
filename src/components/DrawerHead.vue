<script setup>
import DrawerHead from "./DrawerHead.vue";
import { ref } from "vue";

import CartItemList from "./CartItemList.vue";
import { useProductStore } from "../store.js";
import InfoBlock from "./InfoBlock.vue";

const cartStore = useProductStore();
const isCreatingOrder = ref(false);
const orderInfo = ref(null); // Хранит информацию о заказе

const handlePlaceOrder = async () => {
  isCreatingOrder.value = true;

  try {
    const orderData = await cartStore.createOrder(); // orderData содержит id заказа
    console.log("Order placed successfully:", orderData);

    // Сохраняем информацию о заказе
    orderInfo.value = {
      number: orderData.id, // id заказа, возвращённый сервером
      description: "Order placed successfully!",
      imageUrl: "/completed.png",
    };
  } catch (error) {
    console.error("Failed to place order:", error);
    alert("Failed to place order. Please try again."); // Можно заменить другим компонентом, если нужно
  } finally {
    isCreatingOrder.value = false;
  }
};
</script>

<template>
  <div class="fixed top-0 left-0 h-full w-full bg-black z-10 opacity-70"></div>
  <div class="bg-white w-96 h-full fixed right-0 top-0 z-20 p-8">
    <DrawerHead />

    <!-- Если заказ завершён, показываем InfoBlock -->
    <div v-if="orderInfo">
      <InfoBlock
          :title="`Your order number is #${orderInfo.number}`"
          :description="orderInfo.description"
          :imageUrl="orderInfo.imageUrl"
      />
    </div>

    <!-- Если корзина пуста, показываем сообщение -->
    <div
        v-else-if="cartStore.cart.length === 0"
        class="flex flex-col items-center"
    >
      <InfoBlock
          title="The cart is empty"
          description="You probably haven't ordered anything yet"
          imageUrl="/grey-box-empty.png"
      />
    </div>

    <!-- Если корзина непуста -->
    <div v-else>
      <CartItemList />

      <div class="flex flex-col gap-2 mt-10">
        <div class="flex gap-2">
          <span>Total:</span>
          <div class="flex-1 border-b border-dashed"></div>
          <b>{{ cartStore.getTheTotalPrice() }} $</b>
        </div>

        <div class="flex gap-2">
          <span>VAT:</span>
          <div class="flex-1 border-b border-dashed"></div>
          <b>{{ (cartStore.getTheTotalPrice() * 0.05).toFixed(2) }} $</b>
        </div>

        <button
            :disabled="isCreatingOrder"
            @click="handlePlaceOrder"
            class="mt-4 transition bg-lime-500 w-full disabled:bg-slate-300 rounded-xl py-3 text-white hover:bg-lime-600 active:bg-lime-700 cursor-pointer"
        >
          Place order
        </button>
      </div>
    </div>
  </div>
</template>